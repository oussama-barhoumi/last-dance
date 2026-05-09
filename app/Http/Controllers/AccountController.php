<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Accounts/Index', [
            'accounts' => $user->accounts()->get(),
            'totalBalance' => $user->accounts()->sum('balance'),
            'recentTransactions' => $user->transactions()->latest()->take(5)->get(),
        ]);
    }
}
