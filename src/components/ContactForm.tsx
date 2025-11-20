'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/index';
import { Mail, Phone, Building2, Briefcase, FileText, User } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/Toast';

interface ContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export default function ContactForm({
  onSuccess,
  onCancel,
  initialData,
}: ContactFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      source: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData?.id) {
        // Update contact
        await apiClient.put(`/contacts/${initialData.id}`, formData);
        addToast('Contact updated successfully', 'success', 3000);
      } else {
        // Create contact
        await apiClient.post('/contacts', formData);
        addToast('Contact created successfully', 'success', 3000);
      }
      onSuccess?.();
    } catch (err) {
      addToast('Failed to save contact. Please try again.', 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          icon={<User size={18} />}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          icon={<User size={18} />}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        icon={<Mail size={18} />}
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        icon={<Phone size={18} />}
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <Input
        label="Company"
        type="text"
        placeholder="Acme Corp"
        icon={<Building2 size={18} />}
        name="company"
        value={formData.company}
        onChange={handleChange}
      />

      <Input
        label="Job Title"
        type="text"
        placeholder="Sales Manager"
        icon={<Briefcase size={18} />}
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          {initialData ? 'Update Contact' : 'Create Contact'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
