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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->enum('kyc_status', ['none', 'pending', 'approved', 'rejected'])->default('none')->after('address');
            $table->boolean('is_admin')->default(false)->after('kyc_status');
            $table->text('two_factor_secret')->nullable()->after('password');
            $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            $table->softDeletes()->after('updated_at'); // for 30-day grace period
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 
                'address', 
                'kyc_status', 
                'is_admin', 
                'two_factor_secret', 
                'two_factor_recovery_codes', 
                'two_factor_confirmed_at',
                'deleted_at'
            ]);
        });
    }
};
