<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create([
            'name' => 'John Doe',
            'email' => 'admin@harabank.com',
            'password' => bcrypt('password'),
        ]);

        Transaction::factory()->count(50)->create([
            'user_id' => $user->id,
        ]);
    }
}
