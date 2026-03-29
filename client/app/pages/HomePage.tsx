'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function HomePage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/blog/get`
            );

            console.log('API Response (HomePage):', response.data);

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
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Helper to get author name safely
    const getAuthorName = (author: any): string => {
        if (!author) return 'Anonymous';
        if (typeof author === 'string') return author;
        return author.name || author.username || 'Unknown Author';
    };

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchBlogs}
                        className="mt-6 px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-black transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">

            {/* Hero Section */}
            <div className="relative min-h-[640px] flex items-center bg-[url('https://www.bangor.ac.uk/sites/default/files/styles/16x9_1100w/public/2020-05/shutterstock_1252112308%20Resized.jpg?h=d3aaaeb5&itok=pdlLp-Sj')] bg-cover bg-center bg-no-repeat">
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative max-w-3xl mx-auto text-center px-6 z-10">
                    <h1 className="text-5xl font-semibold text-white mb-6 leading-tight">
                        Share Your Thoughts
                    </h1>
                    <p className="text-xl text-white/90 mb-10">
                        A clean and thoughtful space to write, read, and connect through stories.
                    </p>
                </div>
            </div>

            {/* Latest Blogs Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-semibold text-zinc-900">Latest Stories</h2>
                    <Link
                        href="/blogs"
                        className="text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-2 group"
                    >
                        View all
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-zinc-100 animate-pulse h-80" />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-center text-zinc-500 py-12">No stories yet. Check back soon!</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link
                                key={blog._id}
                                href={`/blogs/${blog._id}`}   // ← This is the important change
                                className="block group"
                            >
                                <div className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all duration-300 hover:shadow-lg h-full">
                                    <div className="p-7">
                                        <h3 className="font-semibold text-xl leading-tight mb-4 line-clamp-2 text-zinc-900 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>

                                        <p className="text-zinc-600 text-[15px] leading-relaxed line-clamp-3 mb-6">
                                            {blog.content || blog.excerpt || 'No content available'}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-zinc-500">
                                            <span>
                                                By <span className="font-medium text-zinc-700">
                                                    {getAuthorName(blog.author)}
                                                </span>
                                            </span>
                                            <span>
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}