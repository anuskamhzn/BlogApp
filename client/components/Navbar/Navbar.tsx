// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { User, LogOut, LayoutDashboard  } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [auth, setAuth] = useAuth();
    const router = useRouter();

    // Handle user logout
    const handleLogout = () => {
        setAuth({
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        router.push('/login');
    };

    // Initialize auth state from localStorage on component mount
    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, [setAuth]);

    return (
        <nav className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="text-2xl font-semibold text-zinc-900">Blogify</div>

                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-zinc-700 hover:text-zinc-900 font-medium transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/blogs"
                        className="text-zinc-700 hover:text-zinc-900 font-medium transition-colors"
                    >
                        All Blogs
                    </Link>
                    {auth.user && (
                        <Link
                            href="/create"
                            className="text-zinc-700 hover:text-zinc-900 font-medium transition-colors"
                        >
                            Write
                        </Link>
                    )}

                    {/* User Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-zinc-100 transition-colors">
                            <User className="w-6 h-6 text-zinc-700" />
                        </button>

                        <div className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                        transition-all duration-200 z-50">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-5 py-3 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-5 py-3 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                // Show user info and logout when logged in
                                <>
                                    <div className="px-5 py-3 border-b border-zinc-100">
                                        <p className="text-sm font-medium text-zinc-900">{auth.user.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{auth.user.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-5 py-3 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-5 py-3 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors border-t border-zinc-100"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}