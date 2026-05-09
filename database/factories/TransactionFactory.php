<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $descriptions = [
            'Spotify Subscription', 'Grocery Store', 'Salary Deposit', 'Electric Bill', 
            'Netflix Subscription', 'Transfer to Savings', 'Restaurant Payment', 
            'Gas Station', 'Online Purchase', 'Refund'
        ];

        $types = ['debit', 'credit', 'transfer', 'payment'];
        $statuses = ['completed', 'pending', 'failed', 'cancelled'];
        $methods = ['credit_card', 'bank_transfer', 'cash', 'digital_wallet'];
        $categories = ['Shopping', 'Food & Drink', 'Entertainment', 'Transport', 'Utilities', 'Salary', 'Investment'];

        $type = $this->faker->randomElement($types);
        
        return [
            'user_id' => User::factory(),
            'transaction_id' => 'TXN-' . now()->format('Ymd') . '-' . $this->faker->unique()->numberBetween(100, 999),
            'description' => $this->faker->randomElement($descriptions),
            'category' => $this->faker->randomElement($categories),
            'type' => $type,
            'amount' => $this->faker->randomFloat(2, 10, 5000),
            'status' => $this->faker->randomElement($statuses),
            'payment_method' => $this->faker->randomElement($methods),
            'transaction_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'notes' => $this->faker->sentence(),
        ];
    }
}
