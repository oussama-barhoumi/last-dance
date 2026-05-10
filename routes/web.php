<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'transactions' => auth()->user()->transactions()->latest()->take(5)->get(),
        'investments' => auth()->user()->investments()->get(),
        'budgets' => auth()->user()->budgets()->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // KYC Routes
    Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [\App\Http\Controllers\KycController::class, 'store'])->name('kyc.store');
    
    // Transaction Routes
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions/send', [\App\Http\Controllers\TransactionController::class, 'sendMoney'])->name('transactions.send');
    Route::get('/transactions/export-csv', [\App\Http\Controllers\TransactionController::class, 'exportCsv'])->name('transactions.export-csv');
    Route::get('/transactions/download-statement', [\App\Http\Controllers\TransactionController::class, 'downloadStatement'])->name('transactions.download-statement');
    Route::get('/transactions/payment-methods', [\App\Http\Controllers\TransactionController::class, 'paymentMethods'])->name('transactions.payment-methods');
    Route::get('/transactions/recent-activity', [\App\Http\Controllers\TransactionController::class, 'recentActivity'])->name('transactions.recent-activity');

    // Account Routes
    Route::get('/accounts', [\App\Http\Controllers\AccountController::class, 'index'])->name('accounts.index');

    // Card Routes
    Route::get('/cards', [\App\Http\Controllers\CardController::class, 'index'])->name('cards.index');
    Route::get('/cards/request', [\App\Http\Controllers\CardController::class, 'create'])->name('cards.request');

    // Investment Routes
    Route::get('/investments', [\App\Http\Controllers\InvestmentController::class, 'index'])->name('investments.index');

    // Report Routes
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');

    // Trading Routes
    Route::get('/stocks/{symbol}', [\App\Http\Controllers\TradeController::class, 'getQuote'])->name('stocks.quote');
    Route::post('/trade/buy', [\App\Http\Controllers\TradeController::class, 'buy'])->name('trade.buy');
    Route::post('/trade/sell', [\App\Http\Controllers\TradeController::class, 'sell'])->name('trade.sell');

    // AI Assistant Route
    Route::get('/ai-assistant', [\App\Http\Controllers\AiAssistantController::class, 'index'])->name('ai-assistant.index');

    // Voice Coach Routes
    Route::get('/voice-coach', [\App\Http\Controllers\VoiceCoachController::class, 'index'])->name('voice-coach.index');
    Route::post('/voice-coach/ask', [\App\Http\Controllers\VoiceCoachController::class, 'ask'])->name('voice-coach.ask');

    // Voice Call Routes
    Route::get('/voice-call', [\App\Http\Controllers\VoiceCallController::class, 'index'])->name('voice-call.index');
    Route::post('/voice-call/process', [\App\Http\Controllers\VoiceCallController::class, 'process'])->name('voice-call.process');

    // Loan Routes
    Route::get('/loans', [\App\Http\Controllers\LoanController::class, 'index'])->name('loans.index');
    Route::get('/loans/apply', [\App\Http\Controllers\LoanController::class, 'apply'])->name('loans.apply');
    Route::post('/loans', [\App\Http\Controllers\LoanController::class, 'store'])->name('loans.store');
    Route::post('/loans/pay-emi', [\App\Http\Controllers\LoanController::class, 'payEmi'])->name('loans.pay');

    // Notification Routes
    Route::post('/notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');

    // Settings Routes
    Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    
    // Budget Routes
    Route::post('/budgets', [\App\Http\Controllers\BudgetController::class, 'store'])->name('budgets.store');
    Route::post('/budgets/bulk', [\App\Http\Controllers\BudgetController::class, 'bulkStore'])->name('budgets.bulk-store');
    Route::delete('/budgets/{budget}', [\App\Http\Controllers\BudgetController::class, 'destroy'])->name('budgets.destroy');

    // Utility Routes
    Route::get('/users/lookup', function (Request $request) {
        return \App\Models\User::where('email', $request->email)->firstOrFail();
    })->name('users.lookup');
    
    // Admin Routes (Simplified check)
    Route::get('/admin/kyc', [\App\Http\Controllers\KycController::class, 'adminIndex'])->name('admin.kyc.index');
    Route::patch('/admin/kyc/{document}', [\App\Http\Controllers\KycController::class, 'updateStatus'])->name('admin.kyc.update');
});

require __DIR__.'/auth.php';
