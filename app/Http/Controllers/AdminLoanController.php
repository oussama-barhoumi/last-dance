<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Banker;
use App\Services\LoanApprovalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AdminLoanController extends Controller
{
    protected $approvalService;

    public function __construct(LoanApprovalService $approvalService)
    {
        $this->approvalService = $approvalService;
    }

    public function index(Request $request)
    {
        $query = Loan::with(['user', 'aiAnalysis', 'banker', 'assignment.banker']);

        // Filters
        if ($request->status) $query->where('status', $request->status);
        if ($request->risk_level) {
            $query->whereHas('aiAnalysis', function($q) use ($request) {
                $q->where('risk_level', $request->risk_level);
            });
        }

        $loans = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Loans/Index', [
            'loans' => $loans,
            'stats' => [
                'pending' => Loan::where('status', 'pending_review')->count(),
                'under_review' => Loan::where('status', 'under_review')->count(),
                'high_risk' => Loan::whereHas('aiAnalysis', fn($q) => $q->where('risk_level', 'high'))->count(),
            ],
            'filters' => $request->only(['status', 'risk_level']),
        ]);
    }

    public function approve(Request $request, Loan $loan)
    {
        $this->approvalService->approve($loan, $request->admin_notes);
        
        // Log the decision for audit
        \Illuminate\Support\Facades\Log::info('Loan Approved', [
            'loan_id' => $loan->id,
            'admin_id' => auth()->id(),
            'timestamp' => now(),
        ]);

        return Redirect::back()->with('success', 'Institutional credit authorized. Funds disbursed.');
    }

    public function reject(Request $request, Loan $loan)
    {
        $request->validate(['admin_notes' => 'required|string']);
        
        $this->approvalService->reject($loan, $request->admin_notes);

        return Redirect::back()->with('success', 'Loan request rejected.');
    }

    public function review(Request $request, Loan $loan)
    {
        $this->approvalService->review($loan, $request->admin_notes);

        return Redirect::back()->with('success', 'Loan moved to under review status.');
    }
}
