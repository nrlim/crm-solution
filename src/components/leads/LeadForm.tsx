'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X } from 'lucide-react';

const leadFormSchema = z.object({
  contactId: z.string().min(1, 'Contact is required'),
  source: z.enum(['WEBSITE', 'REFERRAL', 'COLD_CALL', 'EMAIL', 'SOCIAL_MEDIA', 'EVENT', 'OTHER']),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST']),
  score: z.coerce.number().min(0).max(100),
  value: z.coerce.number().min(0),
  expectedCloseDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  lead?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  contacts?: Array<{ id: string; firstName: string; lastName: string; email: string }>;
}

export function LeadForm({ lead, isOpen, onClose, onSubmit, contacts = [] }: LeadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [contactsList, setContactsList] = useState(contacts);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      score: 0,
      value: 0,
      status: 'NEW',
    },
  });

  useEffect(() => {
    if (lead) {
      setValue('contactId', lead.contactId);
      setValue('source', lead.source);
      setValue('status', lead.status);
      setValue('score', lead.score);
      setValue('value', lead.value);
      if (lead.expectedCloseDate) {
        setValue('expectedCloseDate', lead.expectedCloseDate.split('T')[0]);
      }
    } else {
      reset();
    }
  }, [lead, setValue, reset]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiClient.get<any>('/contacts?limit=100');
        const data = response.data as any;
        setContactsList(data.contacts || []);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    if (isOpen && contactsList.length === 0) {
      fetchContacts();
    }
  }, [isOpen, contactsList.length]);

  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      setIsLoading(true);
      console.log('Submitting lead data:', data);
      
      if (lead) {
        const response = await apiClient.put(`/leads/${lead.id}`, data);
        console.log('Update response:', response);
        if (response.error) {
          toast.error(response.error.message || 'Failed to update lead');
          return;
        }
        toast.success('Lead updated successfully');
      } else {
        const response = await apiClient.post('/leads', data);
        console.log('Create response:', response);
        if (response.error) {
          toast.error(response.error.message || 'Failed to create lead');
          console.error('Lead creation error:', response.error);
          return;
        }
        toast.success('Lead created successfully');
      }
      
      reset();
      onClose();
      onSubmit?.();
    } catch (error: any) {
      console.error('Form error:', error);
      toast.error(error.message || 'Failed to save lead');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {lead ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Contact Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact *
            </label>
            <select
              {...register('contactId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select a contact</option>
              {contactsList.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName} ({contact.email})
                </option>
              ))}
            </select>
            {errors.contactId && (
              <p className="mt-1 text-sm text-red-600">{errors.contactId.message}</p>
            )}
          </div>

          {/* Source Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source *
            </label>
            <select
              {...register('source')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select source</option>
              <option value="WEBSITE">Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="COLD_CALL">Cold Call</option>
              <option value="EMAIL">Email</option>
              <option value="SOCIAL_MEDIA">Social Media</option>
              <option value="EVENT">Event</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.source && (
              <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
            )}
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="UNQUALIFIED">Unqualified</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score (0-100) *
            </label>
            <Input
              type="number"
              {...register('score')}
              min="0"
              max="100"
              placeholder="Enter lead score"
            />
            {errors.score && (
              <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
            )}
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value ($) *
            </label>
            <Input
              type="number"
              {...register('value')}
              min="0"
              placeholder="Enter lead value"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
            )}
          </div>

          {/* Expected Close Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Close Date
            </label>
            <Input
              type="date"
              {...register('expectedCloseDate')}
            />
            {errors.expectedCloseDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expectedCloseDate.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : (lead ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
