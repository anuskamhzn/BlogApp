// app/login/page.tsx
'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const [auth, setAuth] = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

            // (Optional) redirect based on role
            if (res.data.user.role === "Admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }

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

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-400 transition-colors text-black"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="w-4 h-4 accent-zinc-900" />
                                    <span className="text-zinc-600">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-zinc-600 hover:text-zinc-900">
                                    Forgot password?
                                </Link>
                            </div> */}

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