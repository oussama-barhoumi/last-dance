<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Investment;
use Carbon\Carbon;

class VoiceCallController extends Controller
{
    public function index()
    {
        return Inertia::render('VoiceCall/Index');
    }

    public function process(Request $request)
    {
        $request->validate(['text' => 'required|string']);
        $user = auth()->user();
        $q = strtolower($request->text);

        // Fetch user context for the AI
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $income = Transaction::where('user_id', $user->id)->where('type', 'credit')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        $spent = Transaction::where('user_id', $user->id)->where('type', 'debit')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        
        if ($income <= 0) $income = 5000; // Mock base

        // Simple Rule-based conversational logic (Simulating GPT with specific financial persona)
        $response = $this->generateCallResponse($q, $income, $spent, $user);

        return response()->json([
            'response' => $response
        ]);
    }

    private function generateCallResponse($q, $income, $spent, $user)
    {
        if (str_contains($q, 'hello') || str_contains($q, 'hi') || str_contains($q, 'hey')) {
            return "Hey {$user->name}! I'm ready to help with your finances. What's on your mind?";
        }

        if (str_contains($q, 'how much') || str_contains($q, 'spent') || str_contains($q, 'spending')) {
            return "You've spent about $" . number_format($spent, 2) . " this month. That's about " . number_format(($spent/$income)*100) . "% of your income.";
        }

        if (str_contains($q, 'loan') || str_contains($q, 'credit')) {
            $dti = ($spent / $income) * 100;
            if ($dti > 40) {
                return "Your monthly bills are a bit high right now. I'd wait on any new loans.";
            }
            return "You're in good shape for a loan! You could comfortably handle about $" . number_format($income * 0.1) . " a month.";
        }

        if (str_contains($q, 'invest') || str_contains($q, 'save')) {
            return "Since you've spent " . number_format(($spent/$income)*100) . "% of your income, I'd put the rest into a high-yield savings account or an Index Fund.";
        }

        if (str_contains($q, 'buy') || str_contains($q, 'should i')) {
            if ($spent > $income * 0.7) {
                return "Your spending is already quite high this month. I'd suggest skipping that for now.";
            }
            return "You've been disciplined lately. If it's something you really need, you can afford it.";
        }

        if (str_contains($q, 'bye') || str_contains($q, 'end')) {
            return "Alright, take care! Call me anytime you need financial advice.";
        }

        return "That's interesting. Tell me more about your financial goals or ask me about your spending.";
    }
}
