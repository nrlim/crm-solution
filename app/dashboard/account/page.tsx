'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Edit2, X, Check, Eye, EyeOff } from 'lucide-react';

interface AccountData {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Fetch account data
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch('/api/account');
        if (response.ok) {
          const data = await response.json();
          setAccount(data.user);
          setFormData({
            name: data.user.name,
          });
        }
      } catch (error) {
        toast.error('Failed to load account information');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
      console.error(error);
    }
  };

  const handleUpdateAccount = async () => {
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccount(data.user);
        setEditMode(false);
        toast.success('Account updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update account');
      }
    } catch (error) {
      toast.error('Failed to update account');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    // Reset errors
    setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });

    // Validation
    const errors = { currentPassword: '', newPassword: '', confirmPassword: '' };
    let hasErrors = false;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      hasErrors = true;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      hasErrors = true;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      hasErrors = true;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      hasErrors = true;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (hasErrors) {
      setPasswordErrors(errors);
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
        toast.success('Password changed successfully!');
        // Redirect to landing page after password change
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        const error = await response.json();
        // Show specific error for incorrect current password
        if (error.error && error.error.includes('Current password is incorrect')) {
          setPasswordErrors({ ...passwordErrors, currentPassword: 'Current password is incorrect' });
          toast.error('Current password is incorrect');
        } else if (error.error && error.error.includes('Not authenticated')) {
          toast.error('Session expired. Please refresh the page.');
        } else {
          toast.error(error.error || 'Failed to change password');
        }
      }
    } catch (error) {
      toast.error('Failed to change password');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Function removed - delete account feature removed from UI
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-40 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load account information</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-600 mt-1">Manage your personal information and security settings</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdateAccount}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition"
              >
                <Check className="w-4 h-4" />
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({ name: account.name });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Full Name</p>
              <p className="text-lg font-medium text-slate-900">{account.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email Address</p>
              <p className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                {account.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Organization Information */}
      {account.organization && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Organization</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Organization Name</p>
              <p className="text-lg font-medium text-slate-900">{account.organization.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Member Since</p>
              <p className="text-lg font-medium text-slate-900">
                {new Date(account.organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Created */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Account Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600">Account Created</p>
            <p className="text-lg font-medium text-slate-900">
              {new Date(account.createdAt).toLocaleDateString()} at{' '}
              {new Date(account.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Last Updated</p>
            <p className="text-lg font-medium text-slate-900">
              {new Date(account.updatedAt).toLocaleDateString()} at{' '}
              {new Date(account.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Security</h2>
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left"
          >
            <Lock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">Change Password</p>
              <p className="text-sm text-slate-600">Update your password regularly</p>
            </div>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, currentPassword: e.target.value });
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition ${
                      passwordErrors.currentPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        currentPassword: !showPasswords.currentPassword,
                      })
                    }
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPasswords.currentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      if (passwordErrors.newPassword) {
                        setPasswordErrors({ ...passwordErrors, newPassword: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition ${
                      passwordErrors.newPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        newPassword: !showPasswords.newPassword,
                      })
                    }
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition ${
                      passwordErrors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirmPassword: !showPasswords.confirmPassword,
                      })
                    }
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                disabled={updating}
                className="flex-1 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 font-medium transition"
              >
                {updating ? 'Updating...' : 'Update Password'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
