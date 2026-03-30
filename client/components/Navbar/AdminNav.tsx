'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

const AdminNav = () => {
  const router = useRouter();
  const [auth, setAuth] = useAuth();

    const handleLogout = () => {
        setAuth({
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        router.push('/login');
    };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="font-semibold text-xl tracking-tight">Admin Panel</h1>
              <p className="text-xs text-zinc-400 -mt-1">Blog Management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link href="/admin" className="hover:text-zinc-300 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/admin/blogs" className="hover:text-zinc-300 transition-colors">
              All Blogs
            </Link>
            <Link href="/admin/users" className="hover:text-zinc-300 transition-colors">
              All Users
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">Admin</div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;