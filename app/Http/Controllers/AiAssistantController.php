<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Investment;
use Carbon\Carbon;

class AiAssistantController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $now = Carbon::now();
        $lastMonth = $now->copy()->subMonth();

        // Data Aggregation
        $income = Transaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->whereBetween('transaction_date', [$lastMonth, $now])
            ->sum('amount');

        $expenses = Transaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->whereBetween('transaction_date', [$lastMonth, $now])
            ->sum('amount');

        $savings = $user->balance + Investment::where('user_id', $user->id)->sum('value');
        
        $transactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get();

        // Rule-based Analysis (Simulating AI Logic based on user prompt)
        $analysis = $this->generateAnalysis($income, $expenses, $savings, $transactions);

        return Inertia::render('AiAssistant/Index', [
            'financialData' => [
                'income' => (float)$income,
                'expenses' => (float)$expenses,
                'savings' => (float)$savings,
                'transactions' => $transactions
            ],
            'analysis' => $analysis
        ]);
    }

    private function generateAnalysis($income, $expenses, $savings, $transactions)
    {
        // Default values if no data
        if ($income <= 0) $income = 5000; // Mock base for empty accounts to show logic
        
        $savingsRate = ($income > 0) ? (($income - $expenses) / $income) * 100 : 0;
        $spendingRisk = "Moderate";
        if ($expenses > $income * 0.8) $spendingRisk = "High Risk";
        elseif ($expenses < $income * 0.5) $spendingRisk = "Low Risk";

        $budgetNeeds = $income * 0.5;
        $budgetWants = $income * 0.3;
        $budgetSavings = $income * 0.2;

        return [
            'summary' => "Your financial health is currently stable, but there are opportunities for optimization. With a current savings rate of " . number_format($savingsRate, 1) . "%, you are maintaining a buffer that protects against immediate volatility.",
            'spendingAnalysis' => [
                'level' => $spendingRisk,
                'details' => $spendingRisk === "High Risk" 
                    ? "Your high expense-to-income ratio indicates a risk of over-leveraging. Reducing non-essential debits is recommended." 
                    : "Your spending behavior is disciplined, allowing for consistent capital accumulation."
            ],
            'budgetRecommendation' => [
                'needs' => $budgetNeeds,
                'wants' => $budgetWants,
                'savings' => $budgetSavings,
                'method' => "50/30/20 Rule"
            ],
            'investmentSuggestion' => [
                'lowRisk' => "High-yield savings accounts or fixed-term deposits at HarborBank.",
                'mediumRisk' => "Diversified Index Funds or Balanced ETFs tracking global markets.",
                'highRisk' => "Direct equity investments in high-growth technology sectors (e.g., HPS, MSFT)."
            ],
            'creditAssessment' => [
                'status' => $expenses < $income * 0.4 ? "Eligible" : "Caution Recommended",
                'debtToIncome' => number_format(($expenses / $income) * 100, 1) . "%",
                'advice' => "Based on your current debt-to-income ratio, you have moderate room for credit utilization. Avoid further leverage if possible."
            ],
            'tips' => [
                "Automate a transfer of $" . number_format($budgetSavings, 2) . " to your savings on the day your income is received.",
                "Review your 'Wants' category for recurring subscriptions that are no longer utilized.",
                "Maintain an emergency fund covering at least 6 months of your average expenses ($" . number_format($expenses * 6, 2) . ")."
            ],
            'disclaimer' => "This is informational guidance, not financial advice."
        ];
    }
}
