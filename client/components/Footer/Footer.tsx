// components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-400 py-12 border-t">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

                    {/* Brand + Copyright */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-white">Blogify</span>
                        <span className="text-zinc-500">•</span>
                        <span>© {new Date().getFullYear()} Blogify. All rights reserved.</span>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                        <a href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="/cookies" className="hover:text-white transition-colors">
                            Cookie Policy
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}