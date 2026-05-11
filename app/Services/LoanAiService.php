<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\LoanAiAnalysis;

class LoanAiService
{
    /**
     * Analyze a loan request using simulated AI logic.
     */
    public function analyze(Loan $loan): LoanAiAnalysis
    {
        $income = $loan->income ?? 0;
        $expenses = $loan->expenses ?? 0;
        $requestedAmount = $loan->amount;
        $duration = $loan->duration;

        // 1. Debt-to-Income Ratio
        $monthlyIncome = $income / 12;
        $monthlyExpenses = $expenses / 12;
        $estimatedEMI = $requestedAmount / ($duration ?: 1);
        
        $totalMonthlyCommitment = $monthlyExpenses + $estimatedEMI;
        $dtiRatio = ($monthlyIncome > 0) ? ($totalMonthlyCommitment / $monthlyIncome) * 100 : 100;

        // 2. Risk Score (Simulated)
        // Base score starts at 100, we deduct points for high risk factors
        $riskScore = 100;
        
        // High DTI is a major risk
        if ($dtiRatio > 50) $riskScore -= 40;
        elseif ($dtiRatio > 35) $riskScore -= 20;

        // Low absolute income is a risk
        if ($income < 20000) $riskScore -= 20;

        // Stability of job (Mock)
        if ($loan->job_type === 'freelance') $riskScore -= 10;

        $riskScore = max(0, min(100, $riskScore));

        // 3. Risk Level
        $riskLevel = 'low';
        if ($riskScore < 40) $riskLevel = 'high';
        elseif ($riskScore < 70) $riskLevel = 'medium';

        // 4. Recommendation
        $recommendation = 'approve';
        if ($riskLevel === 'high') $recommendation = 'reject';
        elseif ($riskLevel === 'medium') $recommendation = 'review';

        // 5. Reasoning
        $reasoning = [];
        if ($income > 50000) $reasoning[] = "Stable and high annual income identified.";
        else $reasoning[] = "Moderate income level.";

        if ($dtiRatio > 40) $reasoning[] = "High debt-to-income ratio detected.";
        else $reasoning[] = "Manageable debt-to-income ratio.";

        if ($loan->amount > ($income * 0.5)) $reasoning[] = "Loan amount is significant compared to annual income.";

        return LoanAiAnalysis::create([
            'loan_id' => $loan->id,
            'risk_score' => $riskScore,
            'risk_level' => $riskLevel,
            'can_afford' => $dtiRatio < 60,
            'debt_to_income_ratio' => round($dtiRatio, 2),
            'reasoning' => $reasoning,
            'summary_feedback' => $this->generateSummary($riskLevel, $recommendation),
            'recommendation' => $recommendation,
        ]);
    }

    private function generateSummary($riskLevel, $recommendation): string
    {
        if ($recommendation === 'approve') {
            return "Strong applicant with low risk indicators. Fast-track approval suggested.";
        } elseif ($recommendation === 'reject') {
            return "High risk profile detected due to financial instability. Rejection recommended.";
        } else {
            return "Applicant is eligible but requires manual verification of income sources.";
        }
    }
}
