'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

interface Lead {
  id: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  };
  source: string;
  status: string;
  score: number;
  value: number;
  expectedCloseDate?: string;
  createdAt: string;
}

interface LeadTableProps {
  leads: Lead[];
  onEdit?: (lead: Lead) => void;
  onRefresh?: () => void;
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-purple-100 text-purple-800',
  QUALIFIED: 'bg-cyan-100 text-cyan-800',
  UNQUALIFIED: 'bg-red-100 text-red-800',
  CONVERTED: 'bg-green-100 text-green-800',
  LOST: 'bg-gray-100 text-gray-800',
};

const sourceColors: Record<string, string> = {
  WEBSITE: 'bg-indigo-50 text-indigo-700',
  REFERRAL: 'bg-pink-50 text-pink-700',
  COLD_CALL: 'bg-yellow-50 text-yellow-700',
  EMAIL: 'bg-green-50 text-green-700',
  SOCIAL_MEDIA: 'bg-blue-50 text-blue-700',
  EVENT: 'bg-purple-50 text-purple-700',
  OTHER: 'bg-gray-50 text-gray-700',
};

export function LeadTable({ leads, onEdit, onRefresh }: LeadTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      setDeletingId(id);
      await apiClient.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully');
      onRefresh?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete lead');
    } finally {
      setDeletingId(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No leads found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Contact</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Company</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Source</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Score</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Value</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Close Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-medium text-slate-900">
                  {lead.contact.firstName} {lead.contact.lastName}
                </p>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{lead.contact.email}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{lead.contact.company || '-'}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${sourceColors[lead.source] || 'bg-slate-100 text-slate-700'}`}>
                  {lead.source}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-slate-100 text-slate-700'}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full"
                      style={{ width: `${lead.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{lead.score}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                ${lead.value.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {lead.expectedCloseDate ? format(new Date(lead.expectedCloseDate), 'MMM dd, yyyy') : '-'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit?.(lead)}
                    className="p-2 hover:bg-cyan-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-cyan-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    disabled={deletingId === lead.id}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
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
