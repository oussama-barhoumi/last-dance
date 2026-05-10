<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TradeController extends Controller
{
    public function getQuote($symbol)
    {
        $response = Http::get("https://finnhub.io/api/v1/quote", [
            'symbol' => strtoupper($symbol),
            'token' => env('FINNHUB_API_KEY')
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch quote'], 500);
        }

        return $response->json();
    }

    public function buy(Request $request)
    {
        $request->validate([
            'symbol' => 'required|string',
            'shares' => 'required|numeric|min:0.0001',
            'price' => 'required|numeric',
            'company_name' => 'required|string'
        ]);

        $user = $request->user();
        $totalCost = $request->shares * $request->price;

        if ($user->balance < $totalCost) {
            return back()->withErrors(['balance' => 'Insufficient funds.']);
        }

        DB::transaction(function () use ($user, $request, $totalCost) {
            // Deduct from balance
            $user->decrement('balance', $totalCost);

            // Update or create investment
            $investment = Investment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'symbol' => strtoupper($request->symbol),
                    'type' => 'stock'
                ],
                [
                    'company_name' => $request->company_name,
                    'sector' => 'Technology', // Default or fetch from profile API
                    'return_percentage' => 0,
                ]
            );

            $investment->increment('shares', $request->shares);
            $investment->increment('value', $totalCost);

            // Create Transaction record
            Transaction::create([
                'user_id' => $user->id,
                'transaction_id' => 'TRD-' . strtoupper(Str::random(10)),
                'description' => "Bought {$request->shares} shares of {$request->symbol}",
                'category' => 'Investment',
                'type' => 'debit',
                'amount' => $totalCost,
                'status' => 'completed',
                'payment_method' => 'Wallet',
                'transaction_date' => now(),
            ]);
        });

        return back()->with('success', "Successfully bought {$request->shares} shares of {$request->symbol}.");
    }

    public function sell(Request $request)
    {
        $request->validate([
            'symbol' => 'required|string',
            'shares' => 'required|numeric|min:0.0001',
            'price' => 'required|numeric'
        ]);

        $user = $request->user();
        $investment = Investment::where('user_id', $user->id)
            ->where('symbol', strtoupper($request->symbol))
            ->first();

        if (!$investment || $investment->shares < $request->shares) {
            return back()->withErrors(['shares' => 'Insufficient shares.']);
        }

        $totalCredit = $request->shares * $request->price;

        DB::transaction(function () use ($user, $investment, $request, $totalCredit) {
            // Add to balance
            $user->increment('balance', $totalCredit);

            // Update investment
            $investment->decrement('shares', $request->shares);
            $investment->decrement('value', $investment->value * ($request->shares / ($investment->shares + $request->shares)));

            if ($investment->shares <= 0) {
                $investment->delete();
            }

            // Create Transaction record
            Transaction::create([
                'user_id' => $user->id,
                'transaction_id' => 'TRD-' . strtoupper(Str::random(10)),
                'description' => "Sold {$request->shares} shares of {$request->symbol}",
                'category' => 'Investment',
                'type' => 'credit',
                'amount' => $totalCredit,
                'status' => 'completed',
                'payment_method' => 'Wallet',
                'transaction_date' => now(),
            ]);
        });

        return back()->with('success', "Successfully sold {$request->shares} shares of {$request->symbol}.");
    }
}
