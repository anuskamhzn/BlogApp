'use client';

import { useState, useEffect } from 'react';
import AdminNav from '@/components/Navbar/AdminNav';
import Footer from '@/components/Footer/Footer';
import AdminRoute from '@/components/Routes/AdminRoute';   // ← Import this

interface Blog {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  status: 'published' | 'draft';
}

const AdminDashboard = () => {
  // Dummy Data
  const stats = {
    totalBlogs: 248,
    totalUsers: 1240,
  };

  const recentBlogs: Blog[] = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in 2026',
      author: 'John Doe',
      createdAt: '2026-03-28',
      views: 12400,
      status: 'published',
    },
    {
      id: '2',
      title: 'Building Scalable Next.js Applications',
      author: 'Sarah Chen',
      createdAt: '2026-03-27',
      views: 8900,
      status: 'published',
    },
    {
      id: '3',
      title: 'Why Tailwind CSS is Dominating Frontend Development',
      author: 'Alex Rivera',
      createdAt: '2026-03-25',
      views: 15600,
      status: 'draft',
    },
  ];

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      alert(`Blog deleted successfully!`);
      // TODO: Later connect with real delete API
    }
  };

  return (
    <AdminRoute>   {/* ← Protection added here */}
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminNav />

        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage blogs and users across the platform</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Total Blogs</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalBlogs}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
            </div>
          </div>

          {/* Recent Blogs Section */}
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Blogs</h2>
                <a href="/admin/blogs" className="text-black hover:underline text-sm font-medium">
                  View all →
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{blog.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-500">
                            {blog.views.toLocaleString()} views
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              blog.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {blog.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="px-5 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;