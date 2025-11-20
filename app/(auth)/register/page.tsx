'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input, Card, CardContent } from '@/components/ui/index';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error', 4000);
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      addToast('Password must be at least 8 characters long', 'error', 4000);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<any>('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.error) {
        addToast(response.error.message || 'Registration failed', 'error', 4000);
      } else {
        addToast('Registration successful! Redirecting to landing page...', 'success', 2000);
        setSuccess(true);
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (err) {
      addToast('Registration failed. Please try again.', 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 flex items-center justify-center px-4 py-8">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 -right-1/3 w-1/3 h-1/3 bg-gradient-to-br from-teal-100/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-cyan-100/40 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="w-16 h-16 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Account Created!
          </h1>
          <p className="text-slate-600 mb-6">
            Welcome to CRM Solution. Your account has been successfully created.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 flex items-center justify-center px-4 py-8">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -right-1/3 w-1/3 h-1/3 bg-gradient-to-br from-teal-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-cyan-100/40 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-center text-slate-600 mb-8 text-sm">
            Join CRM Solution and start managing your sales
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">At least 8 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-teal-600 mt-0.5"
                required
              />
              <span className="text-slate-700">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Create Account Button */}
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link
              href="/"
              className="font-semibold text-teal-600 hover:text-teal-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
