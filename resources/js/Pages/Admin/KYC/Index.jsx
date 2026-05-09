import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, User, FileText, Check, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Index({ pendingDocuments }) {
    const { data, setData, patch, processing } = useForm({
        status: '',
        rejection_reason: '',
    });

    const [selectedDoc, setSelectedDoc] = useState(null);

    const handleStatusUpdate = (docId, status) => {
        patch(route('admin.kyc.update', docId), {
            onSuccess: () => setSelectedDoc(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">KYC Review Panel</h2>}
        >
            <Head title="Admin KYC Review" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-black p-3 rounded-xl">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Pending Verifications</h3>
                                <p className="text-sm text-gray-500">Review and approve user identity documents.</p>
                            </div>
                        </div>

                        {pendingDocuments.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-gray-100">
                                <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h4 className="text-lg font-bold">All caught up!</h4>
                                <p className="text-gray-400">There are no pending KYC documents to review.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {pendingDocuments.map((doc) => (
                                    <div key={doc.id} className="p-6 border border-gray-100 rounded-[24px] hover:border-black/10 transition-colors bg-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 p-4 rounded-2xl">
                                                <User className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{doc.user.name}</h4>
                                                <p className="text-xs text-gray-400">{doc.user.email}</p>
                                                <p className="text-[10px] uppercase tracking-widest font-bold mt-1 text-black/40">{doc.type.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <a 
                                                href={`/storage/${doc.file_path}`} 
                                                target="_blank" 
                                                className="flex items-center gap-2 text-xs font-bold bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <FileText className="w-4 h-4" /> View Document
                                            </a>

                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setData('status', 'approved');
                                                        handleStatusUpdate(doc.id, 'approved');
                                                    }}
                                                    disabled={processing}
                                                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => setSelectedDoc(doc)}
                                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <h4 className="text-xl font-bold">Reject Document</h4>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Please provide a reason for rejecting this document. The user will be notified.</p>
                        
                        <textarea 
                            className="w-full h-32 bg-gray-50 border-gray-100 rounded-2xl p-4 text-sm focus:ring-black focus:border-black mb-6 resize-none"
                            placeholder="Reason for rejection (e.g. Blurry image, Expired ID)..."
                            value={data.rejection_reason}
                            onChange={e => setData('rejection_reason', e.target.value)}
                        />

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setSelectedDoc(null)}
                                className="flex-1 bg-gray-100 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setData('status', 'rejected');
                                    handleStatusUpdate(selectedDoc.id, 'rejected');
                                }}
                                disabled={processing || !data.rejection_reason}
                                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
