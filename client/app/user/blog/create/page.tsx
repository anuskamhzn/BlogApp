'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Eye, EyeOff, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function WriteBlog() {
    const [auth] = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required!");
            return;
        }

        if (!auth?.token) {
            toast.error("Please login to publish a blog");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/blog/create`,
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            toast.success("Blog published successfully!");
            router.push('/user/dashboard')

            // Clear fields after successful publish
            setTitle('');
            setContent('');

            // Optional: Switch back to editor mode
            setIsPreview(false);

        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to publish blog";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Toaster position="top-center" />
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
                            Write a New Blog
                        </h1>
                        <p className="text-zinc-500 mt-2">Share your thoughts with the world</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Preview Toggle */}
                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 hover:bg-white transition text-zinc-700"
                        >
                            {isPreview ? (
                                <>
                                    <EyeOff size={18} /> Edit
                                </>
                            ) : (
                                <>
                                    <Eye size={18} /> Preview
                                </>
                            )}
                        </button>

                        {/* Publish Button */}
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-zinc-900 hover:bg-black disabled:bg-zinc-700 text-white rounded-full transition font-medium"
                        >
                            <Send size={18} />
                            {loading ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>

                {isPreview ? (
                    /* ==================== PREVIEW MODE ==================== */
                    <div className="bg-white border border-zinc-200 rounded-3xl p-12 shadow-sm">
                        {title ? (
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-zinc-900 mb-10 tracking-tight">
                                {title}
                            </h1>
                        ) : (
                            <p className="text-3xl text-zinc-400 italic">Untitled Blog</p>
                        )}

                        <div className="border-b border-zinc-200 pb-8 mb-10">
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                                <div>By {auth?.user?.name || 'You'}</div>
                                <div>Just now</div>
                            </div>
                        </div>

                        <article className="prose prose-zinc prose-lg max-w-none">
                            {content ? (
                                <div
                                    className="leading-relaxed text-zinc-700 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                                />
                            ) : (
                                <p className="text-zinc-400 italic text-center py-20">
                                    Start writing to see the preview...
                                </p>
                            )}
                        </article>
                    </div>
                ) : (
                    /* ==================== EDITOR MODE ==================== */
                    <div className="space-y-8">
                        {/* Title Input */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Write a captivating title..."
                            className="w-full text-5xl md:text-6xl font-bold bg-transparent border-none focus:outline-none placeholder-zinc-300 text-zinc-900"
                        />

                        <div className="h-px bg-zinc-200" />

                        {/* Content Editor */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your blog content here...&#10;You can use line breaks."
                            className="w-full h-[65vh] resize-y bg-white border border-zinc-200 rounded-3xl p-10 text-lg leading-relaxed text-zinc-700 focus:outline-none focus:border-zinc-400 transition"
                        />

                        <div className="flex justify-between text-xs text-zinc-400 px-2">
                            <div>Line breaks are supported in preview</div>
                            <div>{content.length} characters</div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}