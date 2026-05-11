<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class SuperAdminController extends Controller
{
    public function index()
    {
        $users = User::where('id', '!=', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Calculate some global stats
        $totalBalance = User::sum('balance');
        $totalTransactions = \App\Models\Transaction::count();

        // Simple monthly transaction volume for the chart
        $chartData = [
            ['month' => 'Jul', 'volume' => 400],
            ['month' => 'Aug', 'volume' => 300],
            ['month' => 'Sep', 'volume' => 550],
            ['month' => 'Oct', 'volume' => 800],
            ['month' => 'Nov', 'volume' => 450],
            ['month' => 'Dec', 'volume' => 600],
            ['month' => 'Jan', 'volume' => 650],
        ];

        return Inertia::render('SuperAdmin/Dashboard', [
            'recentUsers' => $users,
            'recentTransactions' => \App\Models\Transaction::with(['user', 'sender', 'receiver'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
            'stats' => [
                'total_users' => User::count(),
                'blocked_users' => User::where('is_blocked', true)->count(),
                'active_users' => User::where('is_blocked', false)->count(),
                'total_capital' => $totalBalance,
                'total_transactions' => $totalTransactions,
                'pending_loans' => \App\Models\Loan::where('status', 'pending_review')->count(),
            ],
            'chartData' => $chartData,
            'blockedUsers' => User::where('is_blocked', true)->take(5)->get(),
            'pendingLoans' => \App\Models\Loan::with('user')->where('status', 'pending_review')->latest()->take(5)->get(),
        ]);
    }

    public function manageAdmins()
    {
        return Inertia::render('SuperAdmin/Admins', [
            'admins' => User::whereIn('role', ['admin', 'super_admin'])->get()
        ]);
    }

    public function manageUsers()
    {
        return Inertia::render('SuperAdmin/Users', [
            'users' => User::where('role', 'user')->paginate(20)
        ]);
    }

    public function analytics()
    {
        $loans = \App\Models\Loan::all();
        
        $loanTypeDistribution = $loans->groupBy('type')->map(fn($group) => [
            'name' => $group->first()->type,
            'value' => $group->sum('amount')
        ])->values();

        $statusDistribution = $loans->groupBy('status')->map(fn($group) => [
            'name' => ucfirst($group->first()->status),
            'value' => $group->count()
        ])->values();

        $monthlyVolume = \App\Models\Loan::select(
            \DB::raw("strftime('%m', created_at) as month"),
            \DB::raw('SUM(amount) as total')
        )
        ->groupBy('month')
        ->get()
        ->map(function ($item) {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return [
                'name' => $months[(int)$item->month - 1],
                'value' => (float)$item->total
            ];
        });

        return Inertia::render('SuperAdmin/Analytics', [
            'loanStats' => [
                'total_volume' => $loans->sum('amount'),
                'active_capital' => $loans->where('status', 'approved')->sum('remaining_amount'),
                'interest_yield' => $loans->sum(fn($l) => ($l->amount * ($l->interest_rate ?? 0) / 100)),
                'default_rate' => 0.5, // Mock
            ],
            'typeData' => $loanTypeDistribution,
            'statusData' => $statusDistribution,
            'volumeData' => $monthlyVolume,
        ]);
    }

    public function transactions()
    {
        return Inertia::render('SuperAdmin/Transactions', [
            'transactions' => \App\Models\Transaction::with(['user', 'sender', 'receiver'])->latest()->paginate(50)
        ]);
    }

    public function loans()
    {
        return Inertia::render('SuperAdmin/Loans', [
            'loans' => \App\Models\Loan::with('user')->latest()->get()
        ]);
    }

    public function settings()
    {
        return Inertia::render('SuperAdmin/Settings');
    }

    public function fraud()
    {
        return Inertia::render('SuperAdmin/Fraud');
    }

    public function logs()
    {
        return Inertia::render('SuperAdmin/Logs');
    }

    public function aiMonitoring()
    {
        return Inertia::render('SuperAdmin/AiMonitoring');
    }

    public function reports()
    {
        return Inertia::render('SuperAdmin/Reports');
    }

    public function toggleBlock(User $user)
    {
        if ($user->id === auth()->id()) {
            return Redirect::back()->with('error', 'You cannot block yourself.');
        }

        $user->is_blocked = !$user->is_blocked;
        $user->save();

        $status = $user->is_blocked ? 'blocked' : 'unblocked';
        return Redirect::back()->with('success', "User account {$status} successfully.");
    }
}
