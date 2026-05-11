<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\Banker;
use App\Models\LoanRepayment;
use App\Models\LoanAssignment;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LoanApprovalService
{
    /**
     * Pre-Approve a loan and require bank booking.
     */
    public function approve(Loan $loan, ?string $adminNotes = null): void
    {
        DB::transaction(function () use ($loan, $adminNotes) {
            // 1. Update Status to Pending Booking
            $loan->update([
                'status' => 'approved_pending_booking',
                'admin_notes' => $adminNotes,
                'interest_rate' => 5.5,
            ]);

            // 2. Assign Banker (Optional at this stage, but good for tracking)
            $this->assignBanker($loan);

            // 3. Log the decision
            Log::info('Loan Pre-Approved (Pending Booking)', [
                'loan_id' => $loan->id,
                'admin_id' => auth()->id()
            ]);
        });
    }

    /**
     * Finalize the loan after appointment completion.
     */
    public function finalize(Loan $loan): void
    {
        DB::transaction(function () use ($loan) {
            // 1. Update Status to Active
            $loan->update([
                'status' => 'active',
            ]);

            // 2. Generate Repayment Schedule
            $this->generateRepayments($loan);

            // 3. Update User Balance (Actual Disbursement)
            $user = $loan->user;
            $user->increment('balance', $loan->amount);

            // 4. Log Disbursement Transaction
            Transaction::create([
                'user_id' => $user->id,
                'transaction_id' => 'DISB-' . strtoupper(uniqid()),
                'description' => "Loan Disbursement: {$loan->type}",
                'amount' => $loan->amount,
                'type' => 'credit',
                'category' => 'Loan',
                'status' => 'completed',
                'payment_method' => 'internal_transfer',
                'transaction_date' => now(),
            ]);

            Log::info('Loan Finalized and Disbursed', ['loan_id' => $loan->id]);
        });
    }

    private function generateRepayments(Loan $loan): void
    {
        $amount = $loan->amount;
        $months = $loan->duration;
        $monthlyPayment = $amount / $months;

        for ($i = 1; $i <= $months; $i++) {
            LoanRepayment::create([
                'loan_id' => $loan->id,
                'installment_number' => $i,
                'amount' => $monthlyPayment,
                'principal' => $monthlyPayment,
                'interest' => 0,
                'remaining_balance' => $amount - ($monthlyPayment * $i),
                'due_date' => now()->addMonths($i),
                'status' => 'pending',
            ]);
        }

        $loan->update(['monthly_payment' => $monthlyPayment]);
    }

    private function assignBanker(Loan $loan): void
    {
        $banker = Banker::where('is_available', true)
            ->orderBy('active_loans_count', 'asc')
            ->first();

        if ($banker) {
            $loan->update(['assigned_banker_id' => $banker->id]);
            $banker->increment('active_loans_count');

            LoanAssignment::create([
                'loan_id' => $loan->id,
                'banker_id' => $banker->id,
                'assigned_at' => now(),
            ]);
        }
    }

    public function reject(Loan $loan, string $reason): void
    {
        $loan->update([
            'status' => 'rejected',
            'admin_notes' => $reason,
        ]);
    }

    public function review(Loan $loan, ?string $notes = null): void
    {
        $loan->update([
            'status' => 'under_review',
            'admin_notes' => $notes,
        ]);
    }
}
