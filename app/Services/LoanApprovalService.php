<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\Banker;
use App\Models\LoanRepayment;
use App\Models\LoanAssignment;
use Illuminate\Support\Facades\DB;

class LoanApprovalService
{
    /**
     * Approve a loan and trigger all downstream processes.
     */
    public function approve(Loan $loan, ?string $adminNotes = null): void
    {
        DB::transaction(function () use ($loan, $adminNotes) {
            // 1. Update Status
            $loan->update([
                'status' => 'approved',
                'admin_notes' => $adminNotes,
                'interest_rate' => 5.5, // Standard rate for this example
            ]);

            // 2. Generate Repayment Schedule
            $this->generateRepayments($loan);

            // 3. Assign Banker
            $this->assignBanker($loan);

            // 4. Update User Balance (Disbursement)
            $user = $loan->user;
            $user->increment('balance', $loan->amount);

            // 5. Log Disbursement Transaction
            \App\Models\Transaction::create([
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
        });
    }

    /**
     * Generate equal monthly installments.
     */
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
                'principal' => $monthlyPayment, // Simplified: no interest calc for now
                'interest' => 0,
                'remaining_balance' => $amount - ($monthlyPayment * $i),
                'due_date' => now()->addMonths($i),
                'status' => 'pending',
            ]);
        }

        $loan->update(['monthly_payment' => $monthlyPayment]);
    }

    /**
     * Assign a banker to the loan.
     */
    private function assignBanker(Loan $loan): void
    {
        // Find an available banker with the least active loans
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
                'meeting_scheduled_at' => now()->addDays(2)->setHour(10)->setMinute(0),
                'contact_details' => "Direct Line: {$banker->phone} | Email: {$banker->email}",
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
