import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Contact schemas
export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  source: z.string().optional(),
});

// Lead schemas
export const leadSchema = z.object({
  contactId: z.string().min(1, 'Contact is required'),
  source: z.enum(['WEBSITE', 'REFERRAL', 'COLD_CALL', 'EMAIL', 'SOCIAL_MEDIA', 'EVENT', 'OTHER']),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST']),
  score: z.number().min(0).max(100),
  value: z.number().min(0),
  expectedCloseDate: z.date().optional(),
  notes: z.string().optional(),
});

// Deal schemas
export const dealSchema = z.object({
  name: z.string().min(1, 'Deal name is required'),
  contactId: z.string().min(1, 'Contact is required'),
  description: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  stage: z.enum(['PROSPECT', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
  probability: z.number().min(0).max(100),
  expectedCloseDate: z.date().optional(),
  assignedToId: z.string().optional(),
});

// Activity schemas
export const activitySchema = z.object({
  type: z.enum(['EMAIL', 'CALL', 'MEETING', 'TASK', 'NOTE']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  leadId: z.string().optional(),
});

// Note schemas
export const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  leadId: z.string().optional(),
});

// Organization schemas
export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type DealInput = z.infer<typeof dealSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type OrganizationInput = z.infer<typeof organizationSchema>;
