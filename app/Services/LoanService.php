<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class LoanService
{
    /**
     * Calculate risk score based on user financials.
     */
    public function calculateRiskScore(User $user, float $requestedAmount): int
    {
        // Factor 1: Debt to Asset Ratio (Simplified)
        // High loan vs low balance = high risk
        $balance = max(1, $user->balance);
        $ratio = ($requestedAmount / $balance) * 10;
        
        // Factor 2: Transaction History
        $txCount = $user->transactions()->count();
        $historyBonus = min(20, $txCount * 2);
        
        // Factor 3: KYC Status
        $kycBonus = $user->kyc_status === 'approved' ? 20 : 0;

        $score = round(min(100, max(0, 80 + $historyBonus + $kycBonus - $ratio)));
        
        // We want 100 to be "Best", 0 to be "Worst"
        return (int)$score;
    }

    /**
     * Create a repayment schedule (theoretical).
     */
    public function generateRepaymentSchedule(float $amount, int $durationMonths, float $interestRate): array
    {
        $monthlyRate = ($interestRate / 100) / 12;
        if ($monthlyRate > 0) {
            $monthlyPayment = ($amount * $monthlyRate) / (1 - pow(1 + $monthlyRate, -$durationMonths));
        } else {
            $monthlyPayment = $amount / $durationMonths;
        }

        $schedule = [];
        $remainingBalance = $amount;
        $now = now();

        for ($i = 1; $i <= $durationMonths; $i++) {
            $interest = $remainingBalance * $monthlyRate;
            $principal = $monthlyPayment - $interest;
            $remainingBalance -= $principal;

            $schedule[] = [
                'month' => $i,
                'date' => $now->copy()->addMonths($i)->format('Y-m-d'),
                'payment' => round($monthlyPayment, 2),
                'principal' => round($principal, 2),
                'interest' => round($interest, 2),
                'balance' => round(max(0, $remainingBalance), 2),
            ];
        }

        return $schedule;
    }

    /**
     * Process Loan Approval.
     */
    public function approve(Loan $loan, float $interestRate, ?string $adminNotes = null): bool
    {
        return DB::transaction(function () use ($loan, $interestRate, $adminNotes) {
            $loan->update([
                'status' => 'approved',
                'interest_rate' => $interestRate,
                'admin_notes' => $adminNotes,
                'progress' => 0,
                'remaining_amount' => $loan->amount,
                'monthly_payment' => $this->calculateMonthlyPayment($loan->amount, $loan->duration, $interestRate),
            ]);

            $user = $loan->user;
            $user->balance += $loan->amount;
            $user->save();

            Transaction::create([
                'user_id' => $user->id,
                'transaction_id' => 'LOAN-' . strtoupper(uniqid()),
                'description' => "Capital Injection: {$loan->type} Approved",
                'category' => 'Loan Disbursement',
                'type' => 'credit',
                'amount' => $loan->amount,
                'status' => 'completed',
                'payment_method' => 'institutional_credit',
                'transaction_date' => now(),
            ]);

            return true;
        });
    }

    /**
     * Calculate monthly payment helper.
     */
    private function calculateMonthlyPayment(float $amount, int $duration, float $annualRate): float
    {
        $monthlyRate = ($annualRate / 100) / 12;
        if ($monthlyRate <= 0) return $amount / $duration;
        
        return ($amount * $monthlyRate) / (1 - pow(1 + $monthlyRate, -$duration));
    }
}
