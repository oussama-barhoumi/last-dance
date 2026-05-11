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
        Schema::table('loans', function (Blueprint $table) {
            $table->decimal('interest_rate', 8, 2)->nullable()->change();
            $table->decimal('monthly_payment', 15, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->decimal('interest_rate', 8, 2)->nullable(false)->change();
            $table->decimal('monthly_payment', 15, 2)->nullable(false)->change();
        });
    }
};
