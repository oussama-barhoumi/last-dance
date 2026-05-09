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
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('account_number')->nullable()->unique()->after('account_type');
            $table->string('iban')->nullable()->unique()->after('account_number');
            $table->string('currency')->default('USD')->after('balance');
            $table->boolean('is_verified')->default(true)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn(['account_number', 'iban', 'currency', 'is_verified']);
        });
    }
};
