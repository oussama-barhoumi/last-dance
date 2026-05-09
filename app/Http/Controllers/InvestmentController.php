<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InvestmentController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $investments = $user->investments()->get();
        
        $totalValue = $investments->sum('value');
        $totalInvested = $investments->sum('invested_amount');
        $totalProfit = $totalValue - $totalInvested;
        $profitPercentage = $totalInvested > 0 ? ($totalProfit / $totalInvested) * 100 : 0;

        return Inertia::render('Investments/Index', [
            'investments' => $investments,
            'stats' => [
                'totalValue' => $totalValue,
                'totalInvested' => $totalInvested,
                'totalProfit' => $totalProfit,
                'profitPercentage' => $profitPercentage,
            ],
            'recentTransactions' => $user->transactions()->where('category', 'like', '%Investment%')->orWhere('description', 'like', '%Stock%')->latest()->take(5)->get(),
        ]);
    }
}
