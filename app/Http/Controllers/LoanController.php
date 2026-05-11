<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Transaction;
use App\Services\LoanAiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    protected $aiService;

    public function __construct(LoanAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function index()
    {
        $loans = auth()->user()->loans()
            ->with(['aiAnalysis', 'banker', 'repayments', 'assignment.banker'])
            ->latest()
            ->get();
        
        return Inertia::render('Loans/Index', [
            'activeLoans' => $loans,
            'stats' => [
                'total_balance' => $loans->where('status', 'approved')->sum('remaining_amount'),
                'monthly_payment' => $loans->where('status', 'approved')->sum('monthly_payment'),
                'pending_count' => $loans->where('status', 'pending_review')->count(),
            ],
            'notifications' => auth()->user()->notifications()->latest()->take(5)->get(),
        ]);
    }

    public function apply()
    {
        return Inertia::render('Loans/Apply', [
            'user' => auth()->user()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_type' => 'required|string',
            'amount' => 'required|numeric|min:1000',
            'duration' => 'required|integer|min:3|max:60',
            'purpose' => 'required|string|max:500',
            'income' => 'required|numeric|min:0',
            'expenses' => 'required|numeric|min:0',
            'job_type' => 'required|string',
        ]);

        $user = auth()->user();
        
        if ($user->kyc_status !== 'approved') {
            return back()->withErrors(['loan_type' => 'KYC verification is required for institutional credit.']);
        }

        // 1. Store Loan Request
        $loan = $user->loans()->create([
            'type' => ucfirst($request->loan_type) . ' Loan',
            'provider' => 'HarborBank Institutional',
            'amount' => $request->amount,
            'remaining_amount' => $request->amount,
            'duration' => $request->duration,
            'purpose' => $request->purpose,
            'income' => $request->income,
            'expenses' => $request->expenses,
            'job_type' => $request->job_type,
            'status' => 'pending_review',
            'progress' => 0,
        ]);

        // 2. Trigger AI Analysis Automatically
        $this->aiService->analyze($loan);

        return redirect()->route('loans.index')->with('success', 'Protocol initiated. AI analysis is currently processing your request.');
    }
}
