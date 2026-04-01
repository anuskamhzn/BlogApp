'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/AdminNav';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

const AllUsers = () => {
    const [auth] = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 10;   // Show 10 users per page

    const fetchUsers = async (page: number) => {
        if (!auth?.token) {
            setError("Please log in as admin");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/all-users?page=${page}&limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );

            const data = response.data;

            setUsers(Array.isArray(data.users) ? data.users : []);
            setTotalUsers(data.totalUsers || 0);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || page);

        } catch (err: any) {
            console.error("Fetch error:", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to load users. Are you logged in as admin?");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [auth, currentPage]);

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        if (!auth?.token) {
            toast.error('Please log in as admin to delete users');
            return;
        }

        try {
            setDeleting(userId);
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/delete/${userId}`,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );

            // Remove the deleted user from the list
            setUsers(prev => prev.filter(user => user._id !== userId));
            setTotalUsers(prev => prev - 1);
            toast.success('User deleted successfully!');
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleting(null);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Toaster />
            <Navbar />

            <main className="flex-1">
                {/* Hero/Header Section */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                            All Users
                        </h1>
                        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                            Manage and view all registered users on the platform
                        </p>
                        {!loading && !error && totalUsers > 0 && (
                            <p className="text-gray-500 mt-2">
                                Total: {totalUsers} user{totalUsers !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Loading State - Skeleton Cards */}
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-semibold text-gray-800">Something went wrong</h3>
                            <p className="text-gray-600 mt-2">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && users.length === 0 && (
                        <div className="text-center py-24">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <span className="text-5xl">👥</span>
                            </div>
                            <h3 className="text-3xl font-semibold text-gray-800">No users yet</h3>
                            <p className="text-gray-600 mt-3 max-w-md mx-auto">
                                No users have registered on the platform yet.
                            </p>
                        </div>
                    )}

                    {/* Users List - Vertical Cards */}
                    {!loading && !error && users.length > 0 && (
                        <div className="space-y-4">
                            {users.map((user: User) => (
                                <div
                                    key={user._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <Link href={`/admin/users/${user._id}`} className="flex-1">
                                                <div>
                                                    {/* User Name */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-xl font-semibold text-gray-900">
                                                                {user.name}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                    {/* Email */}
                                                    <div className="mt-4 pl-15">
                                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span>{user.email}</span>
                                                        </div>

                                                        {/* Joined Date */}
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span>Joined {formatDate(user.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteUser(user._id, user.name);
                                                }}
                                                disabled={deleting === user._id}
                                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deleting === user._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-12">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-6 py-3 border rounded-xl disabled:opacity-50 bg-gray-300 text-black/30 hover:bg-gray-100 transition"
                                    >
                                        ← Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-xl font-medium transition ${currentPage === pageNum
                                                    ? 'bg-black text-white'
                                                    : 'border hover:bg-gray-100 text-black/40'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-6 py-3 border rounded-xl disabled:opacity-50 bg-gray-300 text-black/30 hover:bg-gray-100 transition"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AllUsers;