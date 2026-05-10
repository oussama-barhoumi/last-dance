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
        $user = auth()->user();
        return Inertia::render('VoiceCall/Index', [
            'initialGreeting' => "Welcome to Atlas Bank, I'm your virtual assistant. How can I help you today, {$user->name}?"
        ]);
    }

    public function process(Request $request)
    {
        $request->validate(['text' => 'required|string']);
        $user = auth()->user();
        $q = strtolower($request->text);

        // Fetch user context
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $income = Transaction::where('user_id', $user->id)->where('type', 'credit')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        $spent = Transaction::where('user_id', $user->id)->where('type', 'debit')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        
        if ($income <= 0) $income = 5000;

        // Generate Protocol-based Response
        $response = $this->generateAtlasResponse($q, $income, $spent, $user);

        return response()->json([
            'response' => $response
        ]);
    }

    private function generateAtlasResponse($q, $income, $spent, $user)
    {
        // 1. Natural number formatting (e.g. "12 thousand")
        $spentNatural = number_format($spent) . " dirhams";
        
        // 2. Initial Confirmation
        $prefix = "Got it, let me check that for you. ";
        
        // 3. Core Logic
        $body = "";
        
        if (str_contains($q, 'balance') || str_contains($q, 'how much')) {
            $body = "Your current balance is " . number_format($user->balance) . " dirhams. You have spent " . $spentNatural . " this month.";
        }
        elseif (str_contains($q, 'loan') || str_contains($q, 'credit') || str_contains($q, 'borrow')) {
            $dti = ($spent / $income) * 100;
            if ($dti > 40) {
                $body = "Based on your current bills, I would not suggest borrowing more right now. I can transfer you to a credit specialist to discuss your options.";
            } else {
                $body = "You are in a strong position for a loan. You could comfortably manage a repayment of " . number_format($income * 0.1) . " dirhams per month.";
            }
        }
        elseif (str_contains($q, 'invest') || str_contains($q, 'save')) {
            $body = "Since you have some room in your budget, I recommend putting " . number_format($income * 0.2) . " dirhams into a savings plan. Would you like me to show you our current rates?";
        }
        elseif (str_contains($q, 'thank') || str_contains($q, 'bye') || str_contains($q, 'that is all')) {
            return "Thank you for calling Atlas Bank. Have a great day!";
        }
        elseif (str_contains($q, 'problem') || str_contains($q, 'complaint') || str_contains($q, 'help')) {
            return "I'll transfer you to one of our agents who can help you better. Please hold.";
        }
        else {
            return "I'm sorry, could you repeat that please? I want to make sure I help you correctly.";
        }

        // 4. Closing Protocol
        return $prefix . $body . " Is there anything else I can help you with?";
    }
}
