'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input, Card, CardContent } from '@/components/ui/index';
import { Mail, Lock, User, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<any>('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.error) {
        const errorMessage = response.error.message || 'Registration failed';
        // Check if it's an email already exists error
        if (errorMessage.includes('already exists') || errorMessage.includes('email')) {
          setErrors({ email: 'This email is already registered. Please use a different email or try logging in.' });
          addToast('Email already registered', 'error', 4000);
        } else {
          addToast(errorMessage, 'error', 4000);
        }
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
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
              </div>
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
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
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type={showPasswords.password ? 'text' : 'password'}
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPasswords.password ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              {!errors.password && <p className="text-xs text-slate-500 mt-1">At least 8 characters</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPasswords.confirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
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
