'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutGrid, Users, TrendingUp, Zap, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { ReactNode, useState, useRef, useEffect } from 'react';

export default function DashboardLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
    { href: '/dashboard/leads', label: 'Leads', icon: Zap },
    // { href: '/dashboard/deals', label: 'Deals', icon: TrendingUp },
    // { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`w-64 fixed md:static top-0 left-0 h-screen bg-white shadow-sm border-r border-slate-200 hidden md:flex flex-col z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ⚡
            </div>
            <div>
              <p className="font-bold text-lg text-slate-900">
                CRM Pro
              </p>
              <p className="text-xs text-slate-500 font-medium">Sales Engine</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors -ml-2"
            >
              {sidebarOpen ? (
                <X size={20} className="text-slate-700" />
              ) : (
                <Menu size={20} className="text-slate-700" />
              )}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <p className="text-xs font-semibold text-slate-900">
                  {session?.user?.name?.split(' ')[0]}
                </p>
                <p className="text-xs text-slate-500">
                  {session?.user?.email}
                </p>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {session?.user?.email}
                  </p>
                </div>
                <Link
                  href="/dashboard/account"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                >
                  <Settings size={16} />
                  Account Settings
                </Link>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' });
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                    await signOut({ redirect: true, callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
