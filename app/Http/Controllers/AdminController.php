<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transaction;
use App\Models\Loan;
use App\Models\KycDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        // 1. Calculate Statistics
        $stats = [
            'total_users' => User::count(),
            'total_transactions' => Transaction::count(),
            'total_deposits' => Transaction::where('type', 'deposit')->sum('amount'),
            'total_withdrawals' => Transaction::where('type', 'withdrawal')->sum('amount'),
            'pending_loans' => Loan::where('status', 'pending')->count(),
            'suspicious_transactions' => Transaction::where('amount', '>', 10000)->count(), // Example rule
        ];

        // 2. Revenue Data (Last 6 Months)
        $revenueData = Transaction::select(
            DB::raw("strftime('%m', created_at) as month"),
            DB::raw('SUM(amount * 0.02) as revenue') // Assuming 2% fee as revenue
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->get()
        ->map(function ($item) {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return [
                'name' => $months[(int)$item->month - 1],
                'value' => (float)$item->revenue
            ];
        });

        // 3. User Growth (Last 6 Months)
        $growthData = User::select(
            DB::raw("strftime('%m', created_at) as month"),
            DB::raw('COUNT(*) as total')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->get()
        ->map(function ($item) {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return [
                'name' => $months[(int)$item->month - 1],
                'value' => (int)$item->total
            ];
        });

        // 4. Recent Transactions
        $recentTransactions = Transaction::with(['sender', 'receiver', 'user'])
            ->latest()
            ->take(8)
            ->get();

        // 5. Recent Users
        $recentUsers = User::latest()
            ->take(5)
            ->get();

        // 6. Fraud Alerts
        $fraudAlerts = Transaction::where('amount', '>', 50000)
            ->orWhere('status', 'flagged')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'revenueData' => $revenueData,
            'growthData' => $growthData,
            'recentTransactions' => $recentTransactions,
            'recentUsers' => $recentUsers,
            'fraudAlerts' => $fraudAlerts,
        ]);
    }
}
