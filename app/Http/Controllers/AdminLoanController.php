<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\User;
use App\Services\LoanService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AdminLoanController extends Controller
{
    protected $loanService;

    public function __construct(LoanService $loanService)
    {
        $this->loanService = $loanService;
    }

    /**
     * Display listing of loan requests.
     */
    public function index(Request $request)
    {
        $query = Loan::with('user');

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $loans = $query->latest()->paginate(15)->through(function ($loan) {
            $loan->repayment_schedule = $this->loanService->generateRepaymentSchedule(
                (float)$loan->amount, 
                (int)$loan->duration, 
                (float)($loan->interest_rate ?? 5.0)
            );
            return $loan;
        });

        $stats = [
            'pending_count' => Loan::where('status', 'pending')->count(),
            'total_disbursed' => Loan::where('status', 'approved')->sum('amount'),
            'average_risk' => round(Loan::avg('risk_score') ?? 0, 1),
            'approval_rate' => Loan::count() > 0 ? round((Loan::where('status', 'approved')->count() / Loan::count()) * 100, 1) : 0,
        ];

        return Inertia::render('SuperAdmin/Loans', [
            'loans' => $loans,
            'stats' => $stats,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Approve a loan request.
     */
    public function approve(Request $request, Loan $loan)
    {
        $request->validate([
            'interest_rate' => 'required|numeric|min:0',
            'admin_notes' => 'nullable|string',
        ]);

        $this->loanService->approve($loan, (float)$request->interest_rate, $request->admin_notes);

        return Redirect::back()->with('success', 'Institutional credit authorized. Funds synchronized to node balance.');
    }

    /**
     * Reject a loan request.
     */
    public function reject(Request $request, Loan $loan)
    {
        $request->validate([
            'admin_notes' => 'required|string',
        ]);

        $loan->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
        ]);

        return Redirect::back()->with('success', 'Credit application rejected and archived.');
    }

    /**
     * Update risk score manually if needed.
     */
    public function updateRisk(Request $request, Loan $loan)
    {
        $request->validate(['risk_score' => 'required|integer|min:0|max:100']);
        $loan->update(['risk_score' => $request->risk_score]);
        return Redirect::back()->with('success', 'Manual risk override applied.');
    }
}
