'use client';

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function Home() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('Demo123!');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        addToast('Invalid email or password', 'error', 4000);
      } else if (result?.ok) {
        addToast('Login successful!', 'success', 2000);
        setTimeout(() => router.push('/dashboard'), 500);
      }
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 flex flex-col">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -right-1/3 w-1/3 h-1/3 bg-gradient-to-br from-teal-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-cyan-100/40 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold text-slate-900">CRM Solution</span>
          </div>
        </div>
      </nav>

      {/* Hero Section with Login */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Welcome Message */}
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-slate-900 mb-2">Welcome to</span>
              <span className="block bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
                CRM Solution
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Manage your contacts, pipeline, and sales in one unified platform. Streamline your workflow, close deals faster, and grow your business with our powerful CRM.
            </p>
            
            {/* Quick Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span className="text-slate-700">Smart Contact Management</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span className="text-slate-700">Sales Pipeline Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span className="text-slate-700">Real-time Analytics & Reporting</span>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              Sign In
            </h2>
            <p className="text-center text-slate-600 mb-6 text-sm">
              Access your CRM account
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-teal-600"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>

              {/* Sign In Button */}
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold mt-6"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-600 mt-6">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-teal-600 hover:text-teal-700"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 text-xs text-center">© 2025 CRM Solution. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
