'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/AdminNav';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import toast, { Toaster } from 'react-hot-toast';

export default function BlogDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [auth] = useAuth();

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    const handleDeleteBlog = async () => {
        if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        if (!auth?.token) {
            toast.error('Please log in as admin to delete blogs');
            return;
        }

        try {
            setDeleting(true);
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/delete-blog/${id}`,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );
            toast.success('Blog deleted successfully!');
            // Redirect to all blogs page after deletion
            router.push('/admin/blogs');
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error(err.response?.data?.message || 'Failed to delete blog');
        } finally {
            setDeleting(false);
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <Toaster />
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
                <Toaster />
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <h2 className="text-4xl font-semibold text-zinc-800 mb-4">Blog Not Found</h2>
                        <p className="text-zinc-600 mb-8">{error || "The article you're looking for doesn't exist or has been removed."}</p>
                        <Link
                            href="/admin/blogs"
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
            <Toaster />
            <Navbar />

            <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
                {/* Title and Delete Button Row */}
                <div className="flex justify-between items-start gap-4 mb-4">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight text-zinc-900 tracking-tight flex-1">
                        {blog.title}
                    </h1>
                    
                    {/* Delete Button - Only show if admin is logged in */}
                    {auth?.token && (
                        <button
                            onClick={handleDeleteBlog}
                            disabled={deleting}
                            className="px-6 py-2.5 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deleting ? 'Deleting...' : 'Delete Blog'}
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