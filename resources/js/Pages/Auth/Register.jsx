import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const inputClasses = "w-full bg-white/5 border-white/10 rounded-2xl px-12 py-4 text-white placeholder-zinc-500 focus:border-white/20 focus:ring-0 transition-all";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500";

    return (
        <GuestLayout>
            <Head title="Create your HarborBank Account" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-zinc-400 text-sm">Join over 600,000 customers worldwide.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Name */}
                <div className="relative group">
                    <User className={iconClasses} />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className={inputClasses}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                {/* Email */}
                <div className="relative">
                    <Mail className={iconClasses} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className={inputClasses}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Phone */}
                <div className="relative">
                    <Phone className={iconClasses} />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className={inputClasses}
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-1" />
                </div>

                {/* Address */}
                <div className="relative">
                    <MapPin className={iconClasses} />
                    <textarea
                        placeholder="Residential Address"
                        className={`${inputClasses} h-24 resize-none pt-4`}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputError message={errors.address} className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="relative">
                        <Lock className={iconClasses} />
                        <input
                            type="password"
                            placeholder="Password"
                            className={inputClasses}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock className={iconClasses} />
                        <input
                            type="password"
                            placeholder="Confirm"
                            className={inputClasses}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <InputError message={errors.password} className="mt-1" />

                {/* Terms */}
                <div className="flex items-start gap-3 py-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 rounded border-white/10 bg-white/5 text-white focus:ring-0"
                        checked={data.terms}
                        onChange={(e) => setData('terms', e.target.checked)}
                        required
                    />
                    <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed">
                        I agree to the <Link href="#" className="text-white hover:underline">Terms of Service</Link> and <Link href="#" className="text-white hover:underline">Privacy Policy</Link>, including FDIC insurance disclosures.
                    </label>
                </div>
                <InputError message={errors.terms} className="mt-1" />

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                </button>

                <div className="pt-4 text-center">
                    <Link
                        href={route('login')}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                        Already have an account? <span className="font-bold text-white">Log in</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
