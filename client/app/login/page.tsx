// app/login/page.tsx
'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const [auth, setAuth] = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in both fields");
            return;
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                email,
                password,
            });

            setAuth({
                user: res.data.user,
                token: res.data.token,
            });
            toast.success("Login successful!");

            // Small delay to let context update properly
            setTimeout(() => {
                const userRole = res.data.user.role?.toLowerCase();

                if (userRole === "admin") {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            }, 150);

        } catch (error: any) {
            // Handle specific error messages from backend
            if (error?.response?.data?.message === "User not found") {
                toast.error("Email not found. Please check your email address.");
            } else if (error?.response?.data?.message === "Password incorrect") {
                toast.error("Incorrect password. Please try again.");
            } else {
                toast.error(error?.response?.data?.message || "Login failed. Please try again.");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Toaster />
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-semibold text-zinc-900">Welcome Back</h1>
                            <p className="text-zinc-600 mt-2">Sign in to continue to Blogify</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-400 transition-colors text-black pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-700 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link href="/login/forgot-password" className="text-zinc-600 hover:text-zinc-900">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-zinc-900 hover:bg-black text-white font-medium py-3.5 rounded-2xl transition-colors"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-zinc-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-zinc-900 font-medium hover:underline">
                                Create one
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}