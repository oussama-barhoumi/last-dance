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
            ],
            'chartData' => $chartData,
            'blockedUsers' => User::where('is_blocked', true)->take(5)->get(),
        ]);
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
