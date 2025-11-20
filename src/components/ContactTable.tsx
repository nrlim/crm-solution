'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/index';
import { Mail, Phone, Trash2, Edit2 } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
}

interface ContactTableProps {
  contacts: Contact[];
  onDelete?: (id: string) => void;
  onEdit?: (contact: Contact) => void;
  isLoading?: boolean;
}

export default function ContactTable({
  contacts,
  onDelete,
  onEdit,
  isLoading,
}: ContactTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
              Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
              Email
            </th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
              Company
            </th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
              Job Title
            </th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2"
                >
                  <Mail size={16} />
                  {contact.email}
                </a>
              </td>
              <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                {contact.company || '-'}
              </td>
              <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                {contact.jobTitle || '-'}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(contact)}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
                    title="Edit contact"
                  >
                    <Edit2 size={16} className="text-primary-600" />
                  </button>
                  <button
                    onClick={() => onDelete?.(contact.id)}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
                    title="Delete contact"
                  >
                    <Trash2 size={16} className="text-danger-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
