<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('sender_id')->nullable()->after('user_id')->constrained('users');
            $table->foreignId('receiver_id')->nullable()->after('sender_id')->constrained('users');
            $table->string('reference')->unique()->nullable()->after('transaction_id');
            $table->decimal('fee', 10, 2)->default(0)->after('amount');
            $table->string('currency', 3)->default('USD')->after('fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['sender_id']);
            $table->dropForeign(['receiver_id']);
            $table->dropColumn(['sender_id', 'receiver_id', 'reference', 'fee', 'currency']);
        });
    }
};
