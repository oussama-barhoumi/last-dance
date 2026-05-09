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
            ['transaction_id' => 'HB-'.rand(10000, 99999), 'type' => 'expense', 'amount' => 25.00, 'description' => 'Spotify Subscription', 'category' => 'Shopping', 'status' => 'success', 'payment_method' => 'Credit Card', 'date' => now()->subDays(1)],
            ['transaction_id' => 'HB-'.rand(10000, 99999), 'type' => 'expense', 'amount' => 150.00, 'description' => 'Mobile Service', 'category' => 'Repair and Servicing', 'status' => 'success', 'payment_method' => 'Debit Card', 'date' => now()->subDays(2)],
            ['transaction_id' => 'HB-'.rand(10000, 99999), 'type' => 'expense', 'amount' => 1330.00, 'description' => 'Wilson', 'category' => 'Send Money', 'status' => 'pending', 'payment_method' => 'Bank Transfer', 'date' => now()->subDays(3)],
            ['transaction_id' => 'HB-'.rand(10000, 99999), 'type' => 'receive', 'amount' => 150.00, 'description' => 'Freepik', 'category' => 'Service Selling', 'status' => 'success', 'payment_method' => 'External Deposit', 'date' => now()->subDays(4)],
            ['transaction_id' => 'HB-'.rand(10000, 99999), 'type' => 'receive', 'amount' => 1330.00, 'description' => 'Emilly', 'category' => 'Transfer', 'status' => 'success', 'payment_method' => 'Internal Transfer', 'date' => now()->subDays(5)],
            ['transaction_id' => 'HB-'.rand(10000, 99999), 'type' => 'expense', 'amount' => 89.99, 'description' => 'Amazon.com', 'category' => 'Shopping', 'status' => 'failed', 'payment_method' => 'Credit Card', 'date' => now()->subHours(5)],
        ];

        foreach ($transactions as $t) {
            $user->transactions()->create($t);
        }

        // Accounts
        $accounts = [
            [
                'account_type' => 'Main Account',
                'account_number' => '4400 1234 5678 9012',
                'iban' => 'FR76 3000 6000 0112 3456 7890 123',
                'balance' => 45000.00,
                'currency' => 'USD',
                'status' => 'active',
                'is_verified' => true,
            ],
            [
                'account_type' => 'Savings Account',
                'account_number' => '4400 9876 5432 1098',
                'iban' => 'FR76 3000 6000 0198 7654 3210 987',
                'balance' => 125000.50,
                'currency' => 'EUR',
                'status' => 'active',
                'is_verified' => true,
            ],
            [
                'account_type' => 'Current Account',
                'account_number' => '4400 5555 6666 7777',
                'iban' => 'FR76 3000 6000 0155 5566 6677 778',
                'balance' => 8500.00,
                'currency' => 'DH',
                'status' => 'active',
                'is_verified' => false,
            ],
        ];

        foreach ($accounts as $acc) {
            $user->accounts()->create($acc);
        }

        // Cards
        $cards = [
            [
                'card_holder' => 'John Doe',
                'card_number' => '4400 1234 5678 9012',
                'expiry_date' => '12/28',
                'cvv' => '321',
                'type' => 'visa',
                'category' => 'physical',
                'balance' => 45000.00,
                'color_theme' => 'black',
            ],
            [
                'card_holder' => 'John Doe',
                'card_number' => '5500 9876 5432 1098',
                'expiry_date' => '05/27',
                'cvv' => '999',
                'type' => 'mastercard',
                'category' => 'virtual',
                'balance' => 1200.00,
                'color_theme' => 'purple',
            ],
            [
                'card_holder' => 'John Doe',
                'card_number' => '4400 5555 6666 7777',
                'expiry_date' => '09/26',
                'cvv' => '444',
                'type' => 'visa',
                'category' => 'virtual',
                'balance' => 8500.00,
                'color_theme' => 'gradient',
            ],
        ];

        foreach ($cards as $card) {
            $user->cards()->create($card);
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
