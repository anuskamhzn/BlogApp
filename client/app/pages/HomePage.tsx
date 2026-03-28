// app/page.tsx
'use client';

import Link from 'next/link';

export default function HomePage() {
    const dummyBlogs = [
        {
            id: 1,
            title: "How to Learn Next.js in 2026",
            excerpt: "A complete guide for beginners to build modern web applications using Next.js 15.",
            author: "Anuska",
            date: "March 25, 2026",
            image: "https://picsum.photos/id/1015/600/400",
        },
        {
            id: 2,
            title: "The Future of Web Development",
            excerpt: "Exploring trends like AI integration, server components, and edge computing.",
            author: "John Doe",
            date: "March 24, 2026",
            image: "https://picsum.photos/id/106/600/400",
        },
        {
            id: 3,
            title: "Why Authentication Matters",
            excerpt: "Understanding JWT, sessions, and role-based access control in real projects.",
            author: "Sarah Chen",
            date: "March 23, 2026",
            image: "https://picsum.photos/id/201/600/400",
        },
        {
            id: 4,
            title: "Building Your First Blog App",
            excerpt: "Step-by-step tutorial on creating a full-stack blog with authentication.",
            author: "Alex Rivera",
            date: "March 22, 2026",
            image: "https://picsum.photos/id/237/600/400",
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50">

            {/* Hero Section */}
            <div
                className="relative min-h-[640px] flex items-center bg-[url('https://www.bangor.ac.uk/sites/default/files/styles/16x9_1100w/public/2020-05/shutterstock_1252112308%20Resized.jpg?h=d3aaaeb5&itok=pdlLp-Sj')] bg-cover bg-center bg-no-repeat"
            >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative max-w-3xl mx-auto text-center px-6 z-10">
                    <h1 className="text-5xl font-semibold text-white mb-6 leading-tight">
                        Share Your Thoughts
                    </h1>
                    <p className="text-xl text-white/90 mb-10">
                        A clean and thoughtful space to write, read, and connect through stories.
                    </p>

                    <Link
                        href="/register"
                        className="inline-block bg-white text-zinc-900 px-8 py-3.5 rounded-2xl font-medium hover:bg-zinc-100 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Latest Blogs */}
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dummyBlogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all duration-300 group"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-7">
                                <h3 className="font-semibold text-xl leading-tight mb-4 line-clamp-2 text-zinc-900">
                                    {blog.title}
                                </h3>

                                <p className="text-zinc-600 text-[15px] leading-relaxed line-clamp-3 mb-6">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-sm text-zinc-500">
                                    <span>By {blog.author}</span>
                                    <span>{blog.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}