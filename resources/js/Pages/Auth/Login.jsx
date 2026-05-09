import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const inputClasses = "w-full bg-white/5 border-white/10 rounded-2xl px-12 py-4 text-white placeholder-zinc-500 focus:border-white/20 focus:ring-0 transition-all";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500";

    return (
        <GuestLayout>
            <Head title="Secure Vault Access" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-zinc-400 text-sm">Securely access your HarborBank vault.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-400">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div className="relative group">
                    <Mail className={iconClasses} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className={inputClasses}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="relative group">
                    <Lock className={iconClasses} />
                    <input
                        type="password"
                        placeholder="Password"
                        className={inputClasses}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="bg-white/5 border-white/10 text-white focus:ring-0"
                        />
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            Remember this device
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                    Log In
                    <ArrowRight className="w-5 h-5" />
                </button>

                <div className="pt-4 text-center">
                    <Link
                        href={route('register')}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                        Don't have an account? <span className="font-bold text-white">Create one</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
