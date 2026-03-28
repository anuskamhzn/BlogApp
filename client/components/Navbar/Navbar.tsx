// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

export default function Navbar() {
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
                    <Link 
                        href="/create" 
                        className="text-zinc-700 hover:text-zinc-900 font-medium transition-colors"
                    >
                        Write
                    </Link>

                    {/* User Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-zinc-100 transition-colors">
                            <User className="w-6 h-6 text-zinc-700" />
                        </button>

                        <div className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                        transition-all duration-200 z-50">
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
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}