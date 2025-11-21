'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm } from '@/components/leads/LeadForm';

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(searchQuery && { q: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await apiClient.get<any>(`/leads?${params}`);
      const data = response.data as any;
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setPages(data.pages || 0);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [page, pageSize, searchQuery, statusFilter]);

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <TrendingUp size={24} className="text-cyan-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
        </div>
        <p className="text-slate-600">Track and manage your sales pipeline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-slate-600 text-sm font-medium">Total Leads</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-slate-600 text-sm font-medium">New</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{leads.filter(l => l.status === 'NEW').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-slate-600 text-sm font-medium">Qualified</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{leads.filter(l => l.status === 'QUALIFIED').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-slate-600 text-sm font-medium">Pipeline Value</p>
          <p className="text-3xl font-bold text-cyan-600 mt-2">${leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by contact name or email..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 placeholder-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 bg-white hover:bg-slate-50"
        >
          <option value="">All Status</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="UNQUALIFIED">Unqualified</option>
          <option value="CONVERTED">Converted</option>
          <option value="LOST">Lost</option>
        </select>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Lead</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <p className="text-slate-500 mt-3">Loading leads...</p>
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={handleEdit}
            onRefresh={fetchLeads}
          />
        )}
      </div>

      {/* Pagination */}
      {pages > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            {/* Left: Info and Page Size */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-slate-600 whitespace-nowrap">
                Showing <span className="font-semibold text-slate-900">{(page - 1) * pageSize + 1}</span> to{' '}
                <span className="font-semibold text-slate-900">{Math.min(page * pageSize, total)}</span> of{' '}
                <span className="font-semibold text-slate-900">{total}</span> leads
              </p>
              <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent cursor-pointer"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>

            {/* Right: Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors border border-slate-200 disabled:border-slate-100"
                title="Previous page"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                  let pageNum;
                  if (pages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pages - 2) {
                    pageNum = pages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return pageNum;
                }).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all text-sm ${
                      page === pageNum
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent hover:border-slate-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-2 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors border border-slate-200 disabled:border-slate-100"
                title="Next page"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <LeadForm
          lead={selectedLead}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={fetchLeads}
        />
      )}
    </div>
  );
}
