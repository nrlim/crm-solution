'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input, Card, CardContent } from '@/components/ui/index';
import ContactTable from '@/components/ContactTable';
import ContactForm from '@/components/ContactForm';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/Toast';
import { Plus, Search } from 'lucide-react';

export default function ContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch contacts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchContacts();
    }
  }, [status]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<any>('/contacts');
      if (response.data) {
        setContacts(response.data.contacts || []);
      }
    } catch (err) {
      addToast('Failed to load contacts', 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      fetchContacts();
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get<any>(`/contacts?q=${query}`);
      if (response.data) {
        setContacts(Array.isArray(response.data) ? response.data : []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await apiClient.delete(`/contacts/${id}`);
      setContacts(contacts.filter((c) => c.id !== id));
      addToast('Contact deleted successfully', 'success', 3000);
    } catch (err) {
      addToast('Failed to delete contact', 'error', 4000);
    }
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingContact(null);
    fetchContacts();
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Contacts
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Manage your customer contacts
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingContact(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            New Contact
          </Button>
        </div>

        {showForm ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                {editingContact ? 'Edit Contact' : 'Create New Contact'}
              </h2>
              <ContactForm
                initialData={editingContact}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingContact(null);
                }}
              />
            </CardContent>
          </Card>
        ) : null}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              type="search"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={handleSearch}
              icon={<Search size={18} />}
            />
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardContent className="pt-6">
            <ContactTable
              contacts={contacts}
              onDelete={handleDeleteContact}
              onEdit={handleEditContact}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
