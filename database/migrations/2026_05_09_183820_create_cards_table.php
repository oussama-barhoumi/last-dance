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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('card_holder');
            $table->string('card_number'); // Store masked or encrypted in real app
            $table->string('expiry_date');
            $table->string('cvv');
            $table->enum('type', ['visa', 'mastercard']);
            $table->enum('category', ['physical', 'virtual']);
            $table->decimal('balance', 15, 2);
            $table->string('currency')->default('USD');
            $table->boolean('is_frozen')->default(false);
            $table->string('color_theme')->default('black');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
