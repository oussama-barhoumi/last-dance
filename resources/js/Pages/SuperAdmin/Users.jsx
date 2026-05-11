import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, UserPlus, MoreVertical, 
    Shield, ShieldCheck, ShieldAlert, Trash2, 
    Edit2, Eye, Ban, CheckCircle, XCircle,
    ChevronLeft, ChevronRight, X, Mail, Phone,
    MapPin, Wallet, Calendar, ShieldOff
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const StatusBadge = ({ type, active, blocked }) => {
    if (blocked) return (
        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
            Blocked
        </span>
    );
    if (!active) return (
        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-gray-500/10 text-gray-400 border border-gray-500/20">
            Deactivated
        </span>
    );
    return (
        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">
            Active
        </span>
    );
};

const RoleBadge = ({ role }) => {
    const styles = {
        super_admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        admin: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        user: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    };
    return (
        <span className={clsx("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border", styles[role])}>
            {role.replace('_', ' ')}
        </span>
    );
};

export default function UsersManagement({ users, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: '',
        email: '',
        role: '',
        balance: 0,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('super-admin.users.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('super-admin.users.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            balance: user.balance,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        patch(route('super-admin.users.update', selectedUser.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const toggleBlock = (user) => {
        if (confirm(`Are you sure you want to ${user.is_blocked ? 'unblock' : 'block'} this user?`)) {
            router.post(route('super-admin.users.toggle-block', user.id));
        }
    };

    const toggleActive = (user) => {
        if (confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this account?`)) {
            router.post(route('super-admin.users.toggle-active', user.id));
        }
    };

    const deleteUser = (user) => {
        if (confirm('CRITICAL: Permanent deletion of node ID ' + user.id + '. Continue?')) {
            router.delete(route('super-admin.users.destroy', user.id));
        }
    };

    return (
        <DashboardLayout>
            <Head title="Network Node Management" />

            <div className="mt-8 space-y-10 font-mono tracking-tighter">
                {/* Header & Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 bg-white text-black px-4 py-1.5 rounded-full">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Protocol v4.0</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter text-white uppercase">NODE <br /> REGISTRY.</h1>
                    </div>

                    <div className="w-full lg:w-auto space-y-6">
                        <form onSubmit={handleSearch} className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search UUID, Email, or Phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full lg:w-[400px] bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-sm text-white placeholder:text-gray-600 focus:border-white/20 focus:ring-0 transition-all"
                            />
                        </form>

                        <div className="flex flex-wrap gap-4">
                            <select 
                                onChange={(e) => handleFilter('role', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:border-white focus:text-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="admin">Admins</option>
                                <option value="super_admin">Super Admins</option>
                            </select>
                            <select 
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:border-white focus:text-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                                <option value="inactive">Deactivated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40">
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Identified Node</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Security Clearance</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Liquidity</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl font-black text-lg group-hover:bg-white group-hover:text-black transition-all">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className={clsx(
                                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0A0A0A]",
                                                        user.is_active && !user.is_blocked ? "bg-green-500" : "bg-red-500"
                                                    )} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{user.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-10 py-8">
                                            <StatusBadge active={user.is_active} blocked={user.is_blocked} />
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-white">${Number(user.balance).toLocaleString()}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">USD PROTOCOL</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }}
                                                    className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                                                    title="Edit Node"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => toggleBlock(user)}
                                                    className={clsx(
                                                        "p-3 rounded-xl transition-all",
                                                        user.is_blocked ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" : "bg-white/5 text-gray-400 hover:text-red-500"
                                                    )}
                                                    title={user.is_blocked ? "Unblock" : "Block"}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteUser(user)}
                                                    className="p-3 bg-white/5 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                                    title="Purge Node"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-10 py-8 bg-black/20 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Displaying nodes {users.from}-{users.to} of {users.total}
                        </p>
                        <div className="flex gap-2">
                            {users.links.map((link, idx) => (
                                <Link 
                                    key={idx}
                                    href={link.url || '#'}
                                    className={clsx(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        link.active ? "bg-white text-black" : "bg-white/5 text-gray-500 hover:text-white disabled:opacity-50"
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-white/10 w-full max-w-xl rounded-[40px] relative z-10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 flex justify-between items-center border-b border-white/5">
                                <h3 className="text-2xl font-black text-white tracking-tighter">RECONFIGURE NODE</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-500 hover:text-white"><X /></button>
                            </div>
                            <form onSubmit={handleUpdateUser} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Full Identity</label>
                                        <input 
                                            type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-white transition-all"
                                        />
                                        {errors.name && <p className="text-red-500 text-[9px] uppercase font-black">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Terminal</label>
                                        <input 
                                            type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-white transition-all"
                                        />
                                        {errors.email && <p className="text-red-500 text-[9px] uppercase font-black">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Security Level</label>
                                        <select 
                                            value={data.role} onChange={e => setData('role', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-white transition-all appearance-none"
                                        >
                                            <option value="user">User Protocol</option>
                                            <option value="admin">Ops Admin</option>
                                            <option value="super_admin">Root Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Capital Reserve</label>
                                        <input 
                                            type="number" value={data.balance} onChange={e => setData('balance', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-white transition-all"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" disabled={processing}
                                    className="w-full bg-white text-black py-5 rounded-[20px] font-black text-sm uppercase tracking-widest hover:invert transition-all disabled:opacity-50"
                                >
                                    {processing ? 'SYNCING...' : 'COMMIT CHANGES'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Details Modal */}
            <AnimatePresence>
                {isViewModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsViewModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-[40px] relative z-10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-12 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white text-black flex items-center justify-center rounded-3xl font-black text-3xl">
                                            {selectedUser.name.charAt(0)}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedUser.name}</h3>
                                            <div className="flex gap-3">
                                                <RoleBadge role={selectedUser.role} />
                                                <StatusBadge active={selectedUser.is_active} blocked={selectedUser.is_blocked} />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-500 hover:text-white"><X /></button>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <DetailItem icon={Mail} label="Email Terminal" value={selectedUser.email} />
                                    <DetailItem icon={Phone} label="Comm Link" value={selectedUser.phone || 'NO DATA'} />
                                    <DetailItem icon={Wallet} label="Net Assets" value={`$${Number(selectedUser.balance).toLocaleString()}`} />
                                    <DetailItem icon={Calendar} label="Protocol Init" value={new Date(selectedUser.created_at).toLocaleDateString()} />
                                    <DetailItem icon={MapPin} label="Geo Tag" value={selectedUser.address || 'UNKNOWN'} className="col-span-2" />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button 
                                        onClick={() => toggleBlock(selectedUser)}
                                        className={clsx(
                                            "flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border",
                                            selectedUser.is_blocked ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}
                                    >
                                        {selectedUser.is_blocked ? 'RESTORE ACCESS' : 'SUSPEND NODE'}
                                    </button>
                                    <button 
                                        onClick={() => toggleActive(selectedUser)}
                                        className={clsx(
                                            "flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border",
                                            selectedUser.is_active ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" : "bg-white text-black"
                                        )}
                                    >
                                        {selectedUser.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

const DetailItem = ({ icon: Icon, label, value, className }) => (
    <div className={clsx("p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2", className)}>
        <div className="flex items-center gap-2 text-gray-500">
            <Icon className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-black text-white">{value}</p>
    </div>
);
