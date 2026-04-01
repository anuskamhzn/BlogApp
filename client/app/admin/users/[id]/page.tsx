'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/AdminNav';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

const SingleUser = () => {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [auth] = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!auth?.token) {
                setError("Please log in as admin");
                setLoading(false);
                return;
            }

            if (!id) {
                setError("User ID not found");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users-info/${id}`,
                    {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    }
                );

                const data = response.data;
                console.log(data);
                
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    setError(data.message || "User not found");
                }

            } catch (err: any) {
                console.error("Fetch error:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Failed to load user details");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [auth, id]);

    const handleDeleteUser = async () => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleting(true);
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/delete/${id}`,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );
            
            alert('User deleted successfully!');
            router.push('/admin/users');
        } catch (err: any) {
            console.error('Delete error:', err);
            alert(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleting(false);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">User Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || "The user you're looking for doesn't exist."}</p>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Users
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                {/* Back Button */}
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to All Users
                </Link>

                {/* User Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header with Avatar */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-blue-600 shadow-lg mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                            <p className="text-blue-100">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Email */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <p className="text-gray-900">{user.email}</p>
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 justify-end">
                            <button
                                onClick={handleDeleteUser}
                                disabled={deleting}
                                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default SingleUser;