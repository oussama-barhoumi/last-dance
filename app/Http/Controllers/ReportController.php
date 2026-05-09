<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;

class ReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $income = $user->transactions()->where('type', 'receive')->sum('amount');
        $expenses = $user->transactions()->where('type', 'expense')->sum('amount');
        $netFlow = $income - $expenses;

        // Grouping by category for the chart
        $categoryBreakdown = $user->transactions()
            ->where('type', 'expense')
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->get();

        return Inertia::render('Reports/Index', [
            'stats' => [
                'totalIncome' => $income,
                'totalExpenses' => $expenses,
                'netFlow' => $netFlow,
                'savingsRate' => $income > 0 ? (($income - $expenses) / $income) * 100 : 0,
            ],
            'categoryBreakdown' => $categoryBreakdown,
            'recentReports' => [
                ['id' => 'REP-001', 'name' => 'Monthly Financial Audit', 'type' => 'PDF', 'date' => '2026-05-01', 'status' => 'Generated'],
                ['id' => 'REP-002', 'name' => 'Yearly Tax Summary', 'type' => 'CSV', 'date' => '2026-04-15', 'status' => 'Generated'],
                ['id' => 'REP-003', 'name' => 'Investment Yield Report', 'type' => 'PDF', 'date' => '2026-03-30', 'status' => 'Pending'],
            ]
        ]);
    }
}
