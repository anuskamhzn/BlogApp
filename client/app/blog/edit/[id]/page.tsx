'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Eye, EyeOff, Send, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/auth';
import axios from 'axios';
import Link from 'next/link';

export default function EditBlog() {
    const { id } = useParams();           // Get blog ID from URL
    const router = useRouter();
    const [auth] = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch existing blog data
    useEffect(() => {
        const fetchBlog = async () => {
            if (!id || !auth?.token) return;

            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/blog/getByUserId/${auth.user.id}`, // or a dedicated /api/blog/${id} endpoint
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );

                // Find the specific blog
                const blog = Array.isArray(data) 
                    ? data.find((b: any) => b._id === id || b.id === id)
                    : data;

                if (blog) {
                    setTitle(blog.title || '');
                    setContent(blog.content || '');
                } else {
                    toast.error("Blog not found");
                    router.push('/dashboard');
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load blog");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchBlog();
    }, [id, auth]);

    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required!");
            return;
        }

        if (!auth?.token) {
            toast.error("Please login to update blog");
            return;
        }

        setSaving(true);

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/blog/update/${id}`,
                { title, content },
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );

            toast.success("Blog updated successfully!");
            router.push('/dashboard');        // Redirect after success

        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Failed to update blog";
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Toaster position="top-center" />
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <button className="p-2 hover:bg-zinc-100 rounded-lg transition">
                                <ArrowLeft size={24} />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold text-zinc-900">Edit Blog</h1>
                            <p className="text-zinc-500">Update your blog post</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 hover:bg-white transition text-zinc-700"
                        >
                            {isPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                            {isPreview ? 'Edit' : 'Preview'}
                        </button>

                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-2.5 bg-zinc-900 hover:bg-black disabled:bg-zinc-700 text-white rounded-full transition font-medium"
                        >
                            <Send size={18} />
                            {saving ? 'Updating...' : 'Update Blog'}
                        </button>
                    </div>
                </div>

                {isPreview ? (
                    // Preview Mode
                    <div className="bg-white border border-zinc-200 rounded-3xl p-12 shadow-sm">
                        <h1 className="text-5xl font-bold leading-tight text-zinc-900 mb-10">
                            {title || "Untitled Blog"}
                        </h1>

                        <div className="border-b border-zinc-200 pb-8 mb-10">
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                                <div>By {auth?.user?.name || 'You'}</div>
                                <div>Updated just now</div>
                            </div>
                        </div>

                        <article className="prose prose-zinc prose-lg max-w-none">
                            {content ? (
                                <div
                                    className="leading-relaxed text-zinc-700 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                                />
                            ) : (
                                <p className="text-zinc-400 italic">No content</p>
                            )}
                        </article>
                    </div>
                ) : (
                    // Editor Mode
                    <div className="space-y-8">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Write a captivating title..."
                            className="w-full text-5xl md:text-6xl font-bold bg-transparent border-none focus:outline-none placeholder-zinc-300 text-zinc-900"
                        />

                        <div className="h-px bg-zinc-200" />

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your blog content here..."
                            className="w-full h-[65vh] resize-y bg-white border border-zinc-200 rounded-3xl p-10 text-lg leading-relaxed text-zinc-700 focus:outline-none focus:border-zinc-400 transition"
                        />

                        <div className="flex justify-between text-xs text-zinc-400 px-2">
                            <div>Line breaks are supported</div>
                            <div>{content.length} characters</div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}