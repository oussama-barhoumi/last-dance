<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use Carbon\Carbon;

class VoiceCoachController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $data = $this->getFinancialData($user);
        
        $initialMessage = "Hey {$user->name}! I've been looking over your accounts. This month you've spent about $" . number_format($data['total_spent'], 2) . ". About $" . number_format($data['online_spending'], 2) . " of that was online shopping. " . $this->getUnusualPatternMessage($data) . " Do you want me to create a plan for you this month?";

        return Inertia::render('VoiceCoach/Index', [
            'financialData' => $data,
            'initialMessage' => $initialMessage
        ]);
    }

    public function ask(Request $request)
    {
        $request->validate(['question' => 'required|string']);
        $user = auth()->user();
        $data = $this->getFinancialData($user);
        $q = strtolower($request->question);

        $response = "";

        if (str_contains($q, 'spend') || str_contains($q, 'spent')) {
            $response = "You've spent $" . number_format($data['total_spent'], 2) . " so far this month. Most of it went to " . ($data['top_category'] ?? 'various things') . ".";
        } elseif (str_contains($q, 'buy')) {
            if ($data['savings_rate'] < 10) {
                $response = "To be honest, your savings are a bit low right now. Maybe hold off on big purchases for a few weeks?";
            } else {
                $response = "You've been doing great with your budget! You have some room in your 'wants' category if you really need it.";
            }
        } elseif (str_contains($q, 'credit') || str_contains($q, 'loan')) {
            if ($data['dti'] > 40) {
                $response = "I wouldn't recommend taking more credit right now. Your monthly bills are already taking up " . number_format($data['dti']) . "% of what you make.";
            } else {
                $response = "You're in a safe spot to borrow. I'd say a monthly payment of about $" . number_format($data['income'] * 0.1) . " would be easy for you to handle.";
            }
        } elseif (str_contains($q, 'save')) {
            $response = "The easiest way? Let's try cutting back on " . ($data['top_category'] ?? 'online shopping') . " by just 20%. That would put an extra $" . number_format($data['online_spending'] * 0.2) . " in your pocket.";
        } else {
            $response = "I'm not quite sure about that one, but I can tell you all about your spending, help you save, or check if you're ready for a credit. What's on your mind?";
        }

        return response()->json([
            'response' => $response . " Do you want me to create a plan for you this month?"
        ]);
    }

    private function getFinancialData($user)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        $income = Transaction::where('user_id', $user->id)->where('type', 'credit')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        $totalSpent = Transaction::where('user_id', $user->id)->where('type', 'debit')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        $onlineSpending = Transaction::where('user_id', $user->id)->where('type', 'debit')->where('category', 'Shopping')->whereBetween('transaction_date', [$startOfMonth, $now])->sum('amount');
        
        $topCategory = Transaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->whereBetween('transaction_date', [$startOfMonth, $now])
            ->select('category', \DB::raw('sum(amount) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->first();

        if ($income <= 0) $income = 5000; // Fallback for simulation

        return [
            'income' => $income,
            'total_spent' => $totalSpent,
            'online_spending' => $onlineSpending,
            'savings_rate' => (($income - $totalSpent) / $income) * 100,
            'dti' => ($totalSpent / $income) * 100,
            'top_category' => $topCategory ? $topCategory->category : 'General'
        ];
    }

    private function getUnusualPatternMessage($data)
    {
        if ($data['online_spending'] > $data['total_spent'] * 0.4) {
            return "I noticed you've been doing a lot of shopping online lately—it's over 40% of your total spending!";
        }
        return "Everything looks pretty normal with your spending patterns.";
    }
}
