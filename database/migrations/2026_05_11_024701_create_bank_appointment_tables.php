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
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->string('address')->nullable();
            $table->json('available_slots')->nullable(); // e.g. ["09:00", "10:00", ...]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->foreignId('branch_id')->constrained()->onDelete('cascade');
            $table->date('appointment_date');
            $table->string('time_slot');
            $table->string('purpose')->default('final_verification'); // contract_signing, identity_check
            $table->string('status')->default('pending'); // pending, confirmed, completed, missed
            $table->text('notes')->nullable();
            $table->timestamps();

            // Prevent double booking for same branch, date, and slot
            $table->unique(['branch_id', 'appointment_date', 'time_slot'], 'unique_appointment_slot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('branches');
    }
};
