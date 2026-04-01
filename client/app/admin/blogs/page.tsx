'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/AdminNav';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Blog {
  _id: string;
  title: string;
  content?: string;
  author?: {
    name?: string;
    username?: string;
  } | string;
  createdAt: string;
}

const AllBlogs = () => {
  const [auth] = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const limit = 10;   // You can make this dynamic later

  const fetchBlogs = async (page: number) => {
    if (!auth?.token) {
      setError("Please log in as admin");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/all-blogs?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      const data = response.data;

      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      setTotalBlogs(data.totalBlogs || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);

    } catch (err: any) {
      console.error("Fetch error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [auth, currentPage]);

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
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
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success('Blog deleted successfully!');
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
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
              All Blogs
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Manage and view all blog posts on the platform
            </p>
            {!loading && !error && blogs.length > 0 && (
              <p className="text-gray-500 mt-2">
                Total: {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
              </p>
            )}
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
                No blogs found. Create your first blog post!
              </p>
            </div>
          )}

          {/* Blogs Grid - Fixed Grid Layout */}
          {!loading && !error && blogs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Blogs</h2>
                <a href="/admin/blogs" className="text-black hover:underline text-sm font-medium">
                  View all →
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-gray-500">Loading recent blogs...</div>
                ) : error ? (
                  <div className="p-12 text-center text-red-500">{error}</div>
                ) : blogs.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No blogs found</div>
                ) : (
                  blogs.map((blog: any) => (
                    <div
                      key={blog._id || blog.id}
                      className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >

                      <div className="flex items-start justify-between">
                        <Link href={`/admin/blogs/${blog._id || blog.id}`}>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{blog.title}</h3>

                            <p className="text-sm text-gray-500 mt-1">
                              By {blog.author?.name || blog.author || 'Unknown Author'} •{' '}
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>

                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteBlog(blog._id || blog.id)
                            }}
                            disabled={deleting}
                            className="px-5 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                          >
                            {deleting ? 'Deleting...' : 'Delete Blog'}
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
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
            </div>
          )}
        </div>
      </main >

      <Footer />
    </div >
  );
};

export default AllBlogs;