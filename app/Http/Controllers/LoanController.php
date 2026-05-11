<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Transaction;
use App\Services\LoanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoanController extends Controller
{
    protected $loanService;

    public function __construct(LoanService $loanService)
    {
        $this->loanService = $loanService;
    }

    public function index()
    {
        $loans = auth()->user()->loans()->orderBy('created_at', 'desc')->get();
        
        $stats = [
            'total_balance' => $loans->sum('remaining_amount'),
            'monthly_payment' => $loans->where('status', 'approved')->sum('monthly_payment'),
            'remaining_amount' => $loans->sum('remaining_amount'),
            'loan_score' => 785
        ];

        $recentTransactions = Transaction::forUser(auth()->id())
            ->where('category', 'Loan Payment')
            ->orderBy('transaction_date', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($tx) => [
                'id' => $tx->id,
                'description' => $tx->description,
                'amount' => $tx->amount,
                'type' => $tx->type,
                'date' => $tx->transaction_date->diffForHumans(),
                'status' => $tx->status
            ]);

        return Inertia::render('Loans/Index', [
            'stats' => $stats,
            'activeLoans' => $loans,
            'recentTransactions' => $recentTransactions
        ]);
    }

    public function apply()
    {
        return Inertia::render('Loans/Apply', [
            'user' => auth()->user()
        ]);
    }

    public function payEmi(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'amount' => 'required|numeric|min:1',
        ]);

        $user = auth()->user();
        $loan = Loan::findOrFail($request->loan_id);

        if ($user->balance < $request->amount) {
            return back()->withErrors(['amount' => 'Insufficient balance.']);
        }

        DB::transaction(function () use ($user, $loan, $request) {
            $user->decrement('balance', $request->amount);
            $loan->decrement('remaining_amount', $request->amount);
            
            $newProgress = round((($loan->amount - $loan->remaining_amount) / $loan->amount) * 100);
            $loan->update(['progress' => $newProgress]);

            Transaction::create([
                'user_id' => $user->id,
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'description' => 'EMI Payment - ' . $loan->type,
                'type' => 'debit',
                'amount' => $request->amount,
                'status' => 'completed',
                'payment_method' => 'bank_transfer',
                'transaction_date' => now(),
                'category' => 'Loan Payment',
            ]);
        });

        return back()->with('success', 'EMI Paid successfully!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_type' => 'required|string',
            'amount' => 'required|numeric|min:100',
            'duration' => 'required|integer|min:1',
            'purpose' => 'required|string',
        ]);

        $user = auth()->user();
        
        if ($user->kyc_status !== 'approved') {
            return back()->withErrors(['loan_type' => 'KYC verification is required before applying for institutional credit.']);
        }

        $riskScore = $this->loanService->calculateRiskScore($user, $request->amount);

        $loan = auth()->user()->loans()->create([
            'type' => ucfirst($request->loan_type) . ' Loan',
            'provider' => 'HarborBank',
            'amount' => $request->amount,
            'remaining_amount' => $request->amount,
            'interest_rate' => 0,
            'duration' => $request->duration,
            'monthly_payment' => 0, 
            'status' => 'pending',
            'progress' => 0,
            'purpose' => $request->purpose,
            'risk_score' => $riskScore,
            'financial_snapshot' => [
                'balance' => $user->balance,
                'currency' => $user->currency,
                'total_transactions' => $user->transactions()->count(),
            ]
        ]);

        return redirect()->route('loans.index')->with('success', 'Loan application submitted for protocol review.');
    }
}
