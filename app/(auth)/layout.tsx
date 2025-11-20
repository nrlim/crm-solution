import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - CRM Solution',
  description: 'Sign in or create your CRM Solution account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
