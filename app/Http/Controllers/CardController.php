<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Cards/Index', [
            'cards' => $user->cards()->get(),
            'totalCardBalance' => $user->cards()->sum('balance'),
            'recentTransactions' => $user->transactions()->latest()->take(6)->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Cards/Request', [
            'user' => auth()->user()
        ]);
    }
}
