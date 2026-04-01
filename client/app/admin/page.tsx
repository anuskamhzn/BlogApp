'use client';

import { useState, useEffect } from 'react';
import AdminNav from '@/components/Navbar/AdminNav';
import Footer from '@/components/Footer/Footer';
import AdminRoute from '@/components/Routes/AdminRoute';
import { useAuth } from '@/context/auth';
import axios from 'axios';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  author?: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Fixed: changed from Blog[] to User[]
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    totalBlogs: totalBlogs || 0,
    totalUsers: totalUsers || 0,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!auth?.token) {
        setError("Please log in as admin");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/recent-blogs`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );

        const data = response.data;

        setTotalBlogs(data.totalBlogs || 0);
        setBlogs(Array.isArray(data.recentBlogs) ? data.recentBlogs : []);
      } catch (err: any) {
        // console.error("Fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load blogs. Are you logged in as admin?");
        setBlogs([]);
      }
    };

    const fetchUser = async () => {
      if (!auth?.token) {
        setError("Please log in as admin");
        setLoading(false);
        return;
      }

      try {
        // Don't set loading to true here if you want to keep separate loading states
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/all-users`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );

        const data = response.data;

        // Fixed: Changed from data.totalUser to data.totalUsers
        // Changed from data.recentUser to data.users
        setTotalUsers(data.totalUsers || 0);
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err: any) {
        // console.error("Fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load users. Are you logged in as admin?");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    fetchUser();
  }, [auth]);


  return (
    <AdminRoute>
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

          {/* Stats Overview - Total Users will show here */}
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
                    <Link href={`/admin/blogs/${blog._id || blog.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{blog.title}</h3>

                        <p className="text-sm text-gray-500 mt-1">
                          By {blog.author?.name || blog.author || 'Unknown Author'} •{' '}
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                    </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;