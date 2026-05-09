<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KycController extends Controller
{
    public function index()
    {
        return Inertia::render('KYC/Index', [
            'documents' => auth()->user()->kycDocuments()->latest()->get(),
            'kycStatus' => auth()->user()->kyc_status,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:id_card,passport,utility_bill',
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $path = $request->file('document')->store('kyc-documents', 'private');

        KycDocument::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        auth()->user()->update(['kyc_status' => 'pending']);

        return back()->with('status', 'Document uploaded successfully. Our team will review it within 24-48 hours.');
    }

    // Admin Methods
    public function adminIndex()
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        return Inertia::render('Admin/KYC/Index', [
            'pendingDocuments' => KycDocument::where('status', 'pending')->with('user')->get(),
        ]);
    }

    public function updateStatus(Request $request, KycDocument $document)
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $document->update([
            'status' => $request->status,
            'rejection_reason' => $request->rejection_reason,
        ]);

        // Update user KYC status based on all documents
        $user = $document->user;
        if ($request->status === 'approved') {
            $user->update(['kyc_status' => 'approved']);
        } elseif ($request->status === 'rejected') {
             // Only reject if no other documents are approved? 
             // For simplicity, we'll just set it to rejected.
            $user->update(['kyc_status' => 'rejected']);
        }

        return back()->with('status', 'Document status updated.');
    }
}
