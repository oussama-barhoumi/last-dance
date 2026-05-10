import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Anchor, Phone, ShieldCheck, CreditCard, Landmark, PiggyBank,
    Home, Megaphone, Facebook, Twitter, Linkedin, MapPin,
    Mail, ArrowRight, CheckCircle2, Shield, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function Welcome({ auth }) {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-600 selection:text-white">
            <Head title="HarborBank - Banking that moves with you" />

            <nav className="sticky top-0 z-50 bg-blue-950 text-white px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                <Anchor className="w-6 h-6 text-blue-950" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">HarborBank</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="w-4 h-4" />
                            <span>(800) 555-0123</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        <div className="flex items-center gap-8">
                            <LanguageSwitcher />
                            <Link
                                href={route('dashboard')}
                                className="hover:text-white text-gray-400 transition-colors"
                            >
                                {t('nav.dashboard')}
                            </Link>

                            {auth.user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="bg-red-500/10 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        {t('nav.logout')}
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('login')}
                                        className="hover:text-white text-gray-400 transition-colors"
                                    >
                                        {t('nav.login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-white text-blue-900 px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 font-bold"
                                    >
                                        {t('nav.register')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="lg:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-white/10 pt-4"
                    >
                        <Link href="#" className="px-2 py-1">Support & Resources</Link>
                        <Link href={route('dashboard')} className="px-2 py-1 text-center font-bold text-gray-400 hover:text-white transition-colors">Dashboard</Link>

                        {auth.user ? (
                            <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="px-2 py-1 bg-red-500/10 text-red-500 text-center rounded-full font-bold"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-2 py-1 text-center font-bold text-gray-400">Login</Link>
                                <Link href={route('register')} className="px-2 py-1 bg-white text-blue-900 text-center rounded-full font-bold">Create Account</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </nav>
            <section className="relative overflow-hidden pt-16 lg:pt-24 pb-20 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
                        >
                            {t('welcome.banking_that')} <br />
                            <span className="text-gray-400">{t('welcome.moves_with_you')}</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed"
                        >
                            {t('welcome.subtitle')}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-16">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                                    {t('hero.go_to_dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all">
                                        {t('hero.create_account')}
                                    </Link>
                                    <Link href={route('login')} className="bg-gray-100 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                        {t('hero.login')}
                                    </Link>
                                </>
                            )}
                        </motion.div>

                        <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-blue-900/10 transition-colors">
                                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-6 h-6 text-blue-900" />
                                </div>
                                <h3 className="font-bold mb-2">Quick Start</h3>
                                <p className="text-sm text-gray-500">Get started with a checking account in minutes with online verification.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-blue-900/10 transition-colors">
                                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 text-blue-900" />
                                </div>
                                <h3 className="font-bold mb-2">Secure & insured</h3>
                                <p className="text-sm text-gray-500">FDIC-insured products and multi-layer security to protect your accounts.</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img
                                src="/images/hero-bank.png"
                                alt="Modern HarborBank Building"
                                className="w-full aspect-[4/5] object-cover"
                            />
                            {/* Floating Account Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 w-72"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Harbor Checking • Tailored</p>
                                        <h4 className="text-2xl font-bold text-blue-950">$2,450.32</h4>
                                    </div>
                                    <div className="bg-blue-900 p-1 rounded-md">
                                        <Anchor className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500">Available balance  Updated 2m ago</span>
                                    </div>
                                    <div className="pt-3 border-t border-blue-900/5 flex justify-between items-center">
                                        <span className="text-xs font-mono text-gray-400 leading-none">Account # •••• 8621</span>
                                        <div className="flex gap-1">
                                            <div className="w-4 h-4 rounded-full bg-red-500/20" />
                                            <div className="w-4 h-4 rounded-full bg-orange-500/20 -ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -z-10 top-20 -right-20 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -z-10 -bottom-10 -left-10 w-48 h-48 bg-gray-200 rounded-full blur-3xl opacity-30" />
                    </motion.div>
                </div>
            </section>

            {/* 3. Services Section */}
            <section className="bg-gray-50 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('welcome.solutions_title')}</h2>
                        <p className="text-gray-500 max-w-2xl">{t('welcome.solutions_desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Landmark,
                                title: t('welcome.everyday_checking'),
                                desc: t('welcome.everyday_checking_desc'),
                                link: "#"
                            },
                            {
                                icon: PiggyBank,
                                title: t('welcome.savings_investments'),
                                desc: t('welcome.savings_investments_desc'),
                                link: "#"
                            },
                            {
                                icon: Home,
                                title: t('welcome.loans_mortgages'),
                                desc: t('welcome.loans_mortgages_desc'),
                                link: "#"
                            }
                        ].map((service, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start"
                            >
                                <div className="bg-gray-50 p-4 rounded-2xl mb-8">
                                    <service.icon className="w-8 h-8 text-blue-900" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">{service.desc}</p>
                                <Link href={service.link} className="mt-auto group flex items-center gap-2 font-bold text-sm hover:gap-4 transition-all">
                                    {t('welcome.learn_more')} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Trust Bar */}
            <section className="py-12 border-y border-gray-100 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8">
                    <div className="flex flex-wrap items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-bold text-lg"><Shield className="w-5 h-5" /> FDIC</div>
                        <div className="text-2xl font-black italic tracking-tighter">VISA</div>
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-red-500" />
                            <div className="w-6 h-6 rounded-full bg-orange-500 -ml-3" />
                            <span className="ml-1 font-bold text-xs">mastercard</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Secured</div>
                    </div>
                    <div className="text-gray-400 text-sm max-w-md text-right">
                        {t('welcome.trust_text')}
                    </div>
                </div>
            </section>

            {/* 5. Promotions Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/3 bg-gray-50 p-12 rounded-[40px] flex flex-col justify-center">
                        <div className="bg-blue-950 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
                            <Megaphone className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-6">{t('welcome.promotions_title')}</h2>
                        <div className="p-6 bg-white rounded-2xl border border-gray-100">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-3 inline-block">{t('welcome.featured')}</span>
                            <p className="text-gray-900 font-medium leading-relaxed">
                                {t('welcome.promo_featured_desc')}
                            </p>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid sm:grid-cols-3 gap-6">
                        {[
                            { date: "June 02, 2026", title: t('welcome.promo_1_title') },
                            { date: "May 18, 2026", title: t('welcome.promo_2_title') },
                            { date: "Apr 27, 2026", title: t('welcome.promo_3_title') }
                        ].map((promo, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="p-8 rounded-[32px] border border-gray-100 flex flex-col hover:border-blue-600 transition-colors cursor-pointer"
                            >
                                <span className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">{promo.date}</span>
                                <h4 className="font-bold leading-snug">{promo.title}</h4>
                                <div className="mt-auto pt-6">
                                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-blue-950 text-white pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
                        <div className="col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="bg-white p-1 rounded-lg">
                                    <Anchor className="w-5 h-5 text-blue-950" />
                                </div>
                                <span className="text-xl font-bold">HarborBank</span>
                            </div>
                            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                                <p className="flex gap-3"><MapPin className="w-5 h-5 shrink-0" /> 425 Seaside Avenue, Harbor City, CA 94000</p>
                                <div className="flex flex-col gap-2 pt-4">
                                    <Link href="#" className="hover:text-white transition-colors">Branch Locator</Link>
                                    <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-bold mb-6">{t('welcome.footer_personal')}</h5>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_checking')}</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_savings')}</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_credit_cards')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold mb-6">{t('welcome.footer_business')}</h5>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_business_checking')}</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_merchant_services')}</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_corporate_lending')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold mb-6">{t('welcome.footer_support')}</h5>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_help_center')}</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_security_center')}</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_privacy_legal')}</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <h5 className="font-bold mb-6">{t('welcome.footer_stay_connected')}</h5>
                            <div className="flex gap-4 mb-8">
                                <Link href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"><Facebook className="w-5 h-5" /></Link>
                                <Link href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"><Twitter className="w-5 h-5" /></Link>
                                <Link href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder={t('welcome.footer_email_placeholder')}
                                        className="w-full bg-white/10 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-white/30"
                                    />
                                    <button className="absolute right-1 top-1 bg-white text-blue-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-50 transition-colors">
                                        {t('welcome.footer_subscribe')}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500">{t('welcome.footer_respect_privacy')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <p>{t('welcome.footer_rights')}</p>
                        <div className="flex gap-8">
                            <Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_legal')}</Link>
                            <Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_privacy')}</Link>
                            <Link href="#" className="hover:text-white transition-colors">{t('welcome.footer_security')}</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
