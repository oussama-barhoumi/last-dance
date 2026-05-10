<?php

namespace App\Services;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class TransferService
{
    protected $feePercentage = 0.5; // 0.5% transfer fee
    protected $dailyLimit = 50000; // $50,000 daily limit

    public function execute(User $sender, string $receiverEmail, float $amount, string $currency, string $description = null)
    {
        $receiver = User::where('email', $receiverEmail)->firstOrFail();

        $this->validateTransfer($sender, $receiver, $amount);

        $fee = ($amount * $this->feePercentage) / 100;
        $totalDeduction = $amount + $fee;

        return DB::transaction(function () use ($sender, $receiver, $amount, $fee, $totalDeduction, $currency, $description) {
            try {
                // 1. Deduct from Sender
                $sender->decrement('balance', $totalDeduction);

                // 2. Add to Receiver
                $receiver->increment('balance', $amount);

                $reference = 'TRX-' . strtoupper(Str::random(10));

                // 3. Create Sender Transaction Record
                $senderTx = Transaction::create([
                    'user_id' => $sender->id,
                    'sender_id' => $sender->id,
                    'receiver_id' => $receiver->id,
                    'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                    'reference' => $reference,
                    'description' => $description ?? "Transfer to {$receiver->name}",
                    'type' => 'debit',
                    'amount' => $amount,
                    'fee' => $fee,
                    'currency' => $currency,
                    'status' => 'completed',
                    'payment_method' => 'bank_transfer',
                    'transaction_date' => now(),
                    'category' => 'Transfer',
                ]);

                // 4. Create Receiver Transaction Record
                Transaction::create([
                    'user_id' => $receiver->id,
                    'sender_id' => $sender->id,
                    'receiver_id' => $receiver->id,
                    'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                    'reference' => $reference,
                    'description' => $description ?? "Transfer from {$sender->name}",
                    'type' => 'credit',
                    'amount' => $amount,
                    'fee' => 0,
                    'currency' => $currency,
                    'status' => 'completed',
                    'payment_method' => 'bank_transfer',
                    'transaction_date' => now(),
                    'category' => 'Transfer',
                ]);

                return [
                    'success' => true,
                    'transaction_id' => $reference,
                    'amount' => $amount,
                    'fee' => $fee,
                    'new_balance' => $sender->balance
                ];

            } catch (Exception $e) {
                DB::rollBack();
                throw $e;
            }
        });
    }

    protected function validateTransfer(User $sender, User $receiver, float $amount)
    {
        if ($sender->id === $receiver->id) {
            throw new Exception("Self-transfer protocol blocked.");
        }

        if ($sender->balance < ($amount * 1.005)) { // Amount + Fee
            throw new Exception("Insufficient liquidity for this transaction.");
        }

        if ($sender->is_blocked) {
            throw new Exception("Sender account access is currently restricted.");
        }

        if ($receiver->is_blocked) {
            throw new Exception("Recipient account access is currently restricted.");
        }

        // Check daily limit
        $dailyTotal = Transaction::where('sender_id', $sender->id)
            ->whereDate('created_at', now())
            ->where('status', 'completed')
            ->sum('amount');

        if (($dailyTotal + $amount) > $this->dailyLimit) {
            throw new Exception("Daily transfer threshold exceeded.");
        }
    }
}
