import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Index({ documents, kycStatus }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'id_card',
        document: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kyc.store'), {
            onSuccess: () => reset('document'),
        });
    };

    const statusColors = {
        none: 'text-zinc-500',
        pending: 'text-yellow-500',
        approved: 'text-green-500',
        rejected: 'text-red-500',
    };

    const statusIcons = {
        none: Clock,
        pending: Clock,
        approved: CheckCircle,
        rejected: AlertCircle,
    };

    const StatusIcon = statusIcons[kycStatus];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Identity Verification</h2>}
        >
            <Head title="Identity Verification" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className={`p-3 rounded-xl bg-white shadow-sm ${statusColors[kycStatus]}`}>
                                <StatusIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Account Status: <span className="capitalize">{kycStatus}</span></h3>
                                <p className="text-sm text-gray-500">
                                    {kycStatus === 'none' && "Verification required to access all banking features."}
                                    {kycStatus === 'pending' && "Your documents are currently under review."}
                                    {kycStatus === 'approved' && "Your account is fully verified."}
                                    {kycStatus === 'rejected' && "Some documents were rejected. Please check and re-upload."}
                                </p>
                            </div>
                        </div>

                        {kycStatus !== 'approved' && (
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-lg font-bold mb-6">Upload Documents</h4>
                                    <form onSubmit={submit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                                            <select 
                                                className="w-full border-gray-200 rounded-xl focus:ring-black focus:border-black"
                                                value={data.type}
                                                onChange={e => setData('type', e.target.value)}
                                            >
                                                <option value="id_card">National ID Card</option>
                                                <option value="passport">International Passport</option>
                                                <option value="utility_bill">Utility Bill (for Address Verification)</option>
                                            </select>
                                        </div>

                                        <div className="relative group">
                                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer relative overflow-hidden">
                                                <Upload className="w-10 h-10 text-gray-400 mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                                                <input 
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={e => setData('document', e.target.files[0])}
                                                />
                                            </div>
                                            {data.document && (
                                                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-green-600">
                                                    <FileText className="w-4 h-4" />
                                                    {data.document.name}
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={processing || !data.document}
                                            className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50"
                                        >
                                            Submit for Review
                                        </button>
                                    </form>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold mb-6">Recent Submissions</h4>
                                    <div className="space-y-4">
                                        {documents.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic">No documents submitted yet.</p>
                                        ) : (
                                            documents.map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-gray-50 p-2 rounded-lg">
                                                            <FileText className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold capitalize">{doc.type.replace('_', ' ')}</p>
                                                            <p className="text-xs text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-50 border ${statusColors[doc.status]}`}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
