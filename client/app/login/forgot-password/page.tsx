// app/login/forgot-password/page.tsx
'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
                { email, newPassword }
            );

            toast.success(res.data.message || "Password updated successfully!");
            
            // Redirect to login after success
            setTimeout(() => {
                router.push('/login');
            }, 1500);

        } catch (error: any) {
            if (error?.response?.data?.message === "User not found") {
                toast.error("No account found with this email address.");
            } else {
                toast.error(error?.response?.data?.message || "Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Toaster />
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-10">
                        {/* Back Button */}
                        <Link 
                            href="/login" 
                            className="inline-flex items-center text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Back to Login
                        </Link>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-semibold text-zinc-900">Reset Password</h1>
                            <p className="text-zinc-600 mt-2">
                                Enter your email and set a new password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-400 transition-colors text-black"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* New Password Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-400 transition-colors text-black pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-[42px] text-zinc-500 hover:text-zinc-700 focus:outline-none"
                                >
                                    {showNewPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-400 transition-colors text-black pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-[42px] text-zinc-500 hover:text-zinc-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white font-medium py-3.5 rounded-2xl transition-colors mt-4"
                            >
                                {loading ? "Updating Password..." : "Update Password"}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-zinc-600">
                            Remember your password?{' '}
                            <Link href="/login" className="text-zinc-900 font-medium hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}