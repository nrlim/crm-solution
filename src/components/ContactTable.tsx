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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left py-3 px-4 font-semibold text-slate-900">
              Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">
              Email
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">
              Company
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">
              Job Title
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-4">
                <p className="font-medium text-slate-900">
                  {contact.firstName} {contact.lastName}
                </p>
              </td>
              <td className="py-3 px-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-cyan-600 hover:text-cyan-700 flex items-center gap-2"
                >
                  <Mail size={16} />
                  {contact.email}
                </a>
              </td>
              <td className="py-3 px-4 text-slate-600">
                {contact.company || '-'}
              </td>
              <td className="py-3 px-4 text-slate-600">
                {contact.jobTitle || '-'}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(contact)}
                    className="p-2 hover:bg-cyan-100 rounded-lg transition-colors"
                    title="Edit contact"
                  >
                    <Edit2 size={16} className="text-cyan-600" />
                  </button>
                  <button
                    onClick={() => onDelete?.(contact.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete contact"
                  >
                    <Trash2 size={16} className="text-red-600" />
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
