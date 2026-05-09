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
        Schema::table('investments', function (Blueprint $table) {
            if (!Schema::hasColumn('investments', 'category')) {
                $table->string('category')->default('Stock')->after('sector');
            }
            if (!Schema::hasColumn('investments', 'risk_level')) {
                $table->string('risk_level')->default('Medium')->after('category');
            }
            if (!Schema::hasColumn('investments', 'status')) {
                $table->string('status')->default('active')->after('risk_level');
            }
            if (!Schema::hasColumn('investments', 'invested_amount')) {
                $table->decimal('invested_amount', 15, 2)->default(0)->after('value');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropColumn(['category', 'risk_level', 'status', 'invested_amount']);
        });
    }
};
