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
            if (!Schema::hasColumn('loans', 'income')) {
                $table->decimal('income', 15, 2)->nullable();
            }
            if (!Schema::hasColumn('loans', 'expenses')) {
                $table->decimal('expenses', 15, 2)->nullable();
            }
            if (!Schema::hasColumn('loans', 'job_type')) {
                $table->string('job_type')->nullable();
            }
            if (!Schema::hasColumn('loans', 'admin_notes')) {
                $table->text('admin_notes')->nullable();
            }
            if (!Schema::hasColumn('loans', 'assigned_banker_id')) {
                $table->unsignedBigInteger('assigned_banker_id')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            // Drop only if they exist
            $cols = ['income', 'expenses', 'job_type', 'admin_notes', 'assigned_banker_id'];
            foreach($cols as $col) {
                if (Schema::hasColumn('loans', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
