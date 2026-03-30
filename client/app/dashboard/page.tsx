'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useAuth } from '@/context/auth';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserRoute from "@/components/Routes/UserRoute";

export default function Dashboard() {
  const [auth] = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!auth?.user?.id || !auth?.token) {
        setBlogs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blog/getByUserId/${auth.user.id}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
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
        setError(err.response?.data?.message || "Failed to load your blogs");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [auth]);

  const handleEdit = (e: React.MouseEvent, blogId: string | number) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    router.push(`/blog/edit/${blogId}`);
  };

  const handleDelete = async (e: React.MouseEvent, blogId: string | number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this blog?')) return;

    if (!auth?.token) {
      alert('You must be logged in to delete blogs');
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog/delete/${blogId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      // Remove from UI immediately (optimistic update)
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId && blog.id !== blogId));

      alert('Blog deleted successfully!');
    } catch (err: any) {
      console.error('Delete error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete blog';
      alert(errorMsg);
    }
  };

  return (
    <>
      <UserRoute>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your blogs and track performance</p>
              </div>
              <Link href="/blog/create">
                <button
                  className="bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write New Blog
                </button>
              </Link>
            </div>

            {/* Stats Card */}
            <div className="mb-8">
              <div className="bg-black rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Blogs Published</p>
                    <p className="text-4xl font-bold mt-1">
                      {loading ? '...' : blogs.length}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* My Blogs List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">My Blogs</h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading your blogs...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>{error}</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-500">No blogs yet. Start writing your first blog!</p>
                  <Link href="/create">
                    <button className="mt-4 text-black hover:text-zinc-800 font-medium">
                      Write your first blog →
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {blogs.map((blog) => (
                    <Link
                      key={blog._id || blog.id}
                      href={`/dashboard/${blog._id || blog.id}`}
                      className="block hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
                              {blog.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {blog.content || blog.excerpt || 'No content available'}
                            </p>
                            <div className="text-sm text-gray-500">
                              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 ml-6" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleEdit(e, blog._id || blog.id)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, blog._id || blog.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
      </UserRoute>
    </>
  );
}