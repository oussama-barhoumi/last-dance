<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Transaction;
use App\Models\Investment;
use App\Models\Account;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an admin user if not exists
        $user = User::updateOrCreate(
            ['email' => 'admin@harborbank.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'phone' => '(800) 555-0123',
                'address' => '425 Seaside Avenue, Harbor City, CA 94000',
                'balance' => 9250.00,
                'currency' => 'USD',
                'is_admin' => true,
                'kyc_status' => 'approved',
            ]
        );

        // Transactions
        $transactions = [
            ['type' => 'expense', 'amount' => 25.00, 'description' => 'Spotify Subscription', 'category' => 'Shopping', 'date' => now()->subDays(1)],
            ['type' => 'expense', 'amount' => 150.00, 'description' => 'Mobile Service', 'category' => 'Repair and Servicing', 'date' => now()->subDays(2)],
            ['type' => 'expense', 'amount' => 1330.00, 'description' => 'Wilson', 'category' => 'Send Money', 'date' => now()->subDays(3)],
            ['type' => 'receive', 'amount' => 150.00, 'description' => 'Freepik', 'category' => 'Service Selling', 'date' => now()->subDays(4)],
            ['type' => 'receive', 'amount' => 1330.00, 'description' => 'Emilly', 'category' => 'Transfer', 'date' => now()->subDays(5)],
        ];

        foreach ($transactions as $t) {
            $user->transactions()->create($t);
        }

        // Investments
        $investments = [
            ['company_name' => 'Apple Store', 'sector' => 'E-commerce, Marketplace', 'value' => 54000.00, 'return_percentage' => 16.00],
            ['company_name' => 'Samsung Mobile', 'sector' => 'E-commerce, Marketplace', 'value' => 25300.00, 'return_percentage' => -4.00],
        ];

        foreach ($investments as $i) {
            $user->investments()->create($i);
        }

        // Accounts
        $accounts = [
            ['account_type' => 'Main Savings', 'balance' => 7500.00, 'status' => 'active'],
            ['account_type' => 'Investment Account', 'balance' => 1750.00, 'status' => 'active'],
        ];

        foreach ($accounts as $a) {
            $user->accounts()->create($a);
        }
    }
}
