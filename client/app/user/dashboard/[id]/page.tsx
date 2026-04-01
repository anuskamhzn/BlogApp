'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

export default function BlogDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [auth] = useAuth();

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/blog/get/${id}`
                );

                const blogData = response.data;
                if (blogData) {
                    setBlog(blogData);
                } else {
                    setError("Blog not found");
                }
            } catch (err: any) {
                console.error("Error fetching blog:", err);
                setError(
                    err.response?.status === 404 
                        ? "Blog not found" 
                        : err.response?.data?.message || "Failed to load the blog"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/user/blog/edit/${id}`);
    };

    const getAuthorName = (author: any): string => {
        if (!author) return 'Anonymous';
        if (typeof author === 'string') return author;
        return author.name || author.username || 'Unknown Author';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Convert plain text with newlines into proper HTML paragraphs
    const formatContent = (content: string): string => {
        if (!content) return '';

        return content
            .split(/\n\s*\n/)           // Split by double newlines (paragraphs)
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => {
                // Convert single newlines inside paragraph to <br>
                const withBreaks = paragraph.replace(/\n/g, '<br>');
                return `<p class="mb-6 leading-relaxed">${withBreaks}</p>`;
            })
            .join('');
    };

    // Check if current user is the author
    const isAuthor = () => {
        if (!auth?.user || !blog?.author) return false;
        
        const authorId = typeof blog.author === 'object' ? blog.author._id : blog.author;
        return auth.user.id === authorId || auth.user._id === authorId;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-zinc-300 border-t-zinc-900 rounded-full mx-auto"></div>
                        <p className="mt-6 text-zinc-500 text-lg">Loading article...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <h2 className="text-4xl font-semibold text-zinc-800 mb-4">Blog Not Found</h2>
                        <p className="text-zinc-600 mb-8">{error || "The article you're looking for doesn't exist or has been removed."}</p>
                        <Link
                            href="/blogs"
                            className="inline-block px-8 py-3.5 bg-zinc-900 text-white rounded-full hover:bg-black transition font-medium"
                        >
                            ← Back to All Blogs
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
                {/* Title with Edit Button */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight text-zinc-900 tracking-tight flex-1">
                        {blog.title}
                    </h1>
                    
                    {/* Edit Button - Only show if user is author */}
                    {isAuthor() && (
                        <button
                            onClick={handleEdit}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                            title="Edit blog"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-zinc-500 mb-12 border-b border-zinc-200 pb-8">
                    <div className="font-medium text-zinc-700">
                        By {getAuthorName(blog.author)}
                    </div>
                    <div className="text-sm">
                        {formatDate(blog.createdAt)}
                    </div>
                </div>

                {/* Blog Content - Now with proper paragraphs */}
                <article className="prose prose-zinc prose-lg max-w-none">
                    {blog.content ? (
                        <div
                            className="leading-relaxed text-zinc-700"
                            dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                        />
                    ) : (
                        <p className="text-zinc-500 italic text-lg">No content available for this blog.</p>
                    )}
                </article>
            </main>

            <Footer />
        </div>
    );
}