'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import Link from 'next/link';

const AllBlogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/blog/get`
                );

                let blogsData = response.data;

                if (Array.isArray(blogsData)) {
                    setBlogs(blogsData);
                } else if (blogsData?.data && Array.isArray(blogsData.data)) {
                    setBlogs(blogsData.data);
                } else if (blogsData?.message === "No blogs found") {
                    setBlogs([]);
                } else {
                    setBlogs(blogsData ? [blogsData] : []);
                }
            } catch (err: any) {
                console.error("Error fetching blogs:", err);
                setError(err.response?.data?.message || "Failed to load blogs");
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Helper to get author name safely
    const getAuthorName = (author: any): string => {
        if (!author) return 'Anonymous';
        if (typeof author === 'string') return author;
        return author.name || author.username || 'Unknown Author';
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1">
                {/* Hero/Header Section */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                            All Blogs
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover insightful articles, tutorials, and stories from our community
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Loading State - Skeleton Cards */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-52 bg-gray-200"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        <div className="flex justify-between pt-4">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </div>
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
                    {!loading && !error && blogs.length === 0 && (
                        <div className="text-center py-24">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <span className="text-5xl">📝</span>
                            </div>
                            <h3 className="text-3xl font-semibold text-gray-800">No blogs yet</h3>
                            <p className="text-gray-600 mt-3 max-w-md mx-auto">
                                We haven't published any blogs yet. Check back soon!
                            </p>
                        </div>
                    )}

                    {/* Blogs Grid */}
                    {!loading && !error && blogs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <Link
                                    href={`/blogs/${blog.slug || blog._id}`}
                                    key={blog._id || blog.id}
                                    className="group"
                                >
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">

                                        <div className="flex-1 p-7 flex flex-col">
                                            <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                {blog.title}
                                            </h3>

                                            <p className="mt-4 text-gray-600 line-clamp-3 flex-1">
                                                {blog.content || blog.excerpt || 'No content available'}
                                            </p>

                                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
                                                <div>
                                                    <span className='text-black/60'>
                                                        By <span className="font-medium text-zinc-900">
                                                            {getAuthorName(blog.author)}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="text-gray-500">
                                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AllBlogs;