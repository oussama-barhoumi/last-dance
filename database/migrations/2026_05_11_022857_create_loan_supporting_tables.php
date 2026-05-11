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
        Schema::create('bankers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('specialization')->nullable();
            $table->integer('active_loans_count')->default(0);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('loan_ai_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->integer('risk_score');
            $table->string('risk_level'); // low, medium, high
            $table->boolean('can_afford');
            $table->decimal('debt_to_income_ratio', 5, 2);
            $table->json('reasoning');
            $table->text('summary_feedback');
            $table->string('recommendation');
            $table->timestamps();
        });

        Schema::create('loan_repayments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->integer('installment_number');
            $table->decimal('amount', 15, 2);
            $table->decimal('principal', 15, 2);
            $table->decimal('interest', 15, 2);
            $table->decimal('remaining_balance', 15, 2);
            $table->date('due_date');
            $table->date('paid_at')->nullable();
            $table->string('status')->default('pending'); // pending, paid, overdue
            $table->timestamps();
        });

        Schema::create('loan_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->foreignId('banker_id')->constrained()->onDelete('cascade');
            $table->dateTime('assigned_at');
            $table->dateTime('meeting_scheduled_at')->nullable();
            $table->text('contact_details')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_assignments');
        Schema::dropIfExists('loan_repayments');
        Schema::dropIfExists('loan_ai_analyses');
        Schema::dropIfExists('bankers');
    }
};
