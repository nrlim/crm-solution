// Mock in-memory database for contacts
// TODO: Replace with Prisma when database is connected

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  ownerId: string;
}

// In-memory storage
const contactsStore = new Map<string, Contact>();
let contactIdCounter = 1;

export function createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> & { organizationId: string; ownerId: string }): Contact {
  const id = `contact-${contactIdCounter++}`;
  const contact: Contact = {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  contactsStore.set(id, contact);
  return contact;
}

export function getContact(id: string): Contact | undefined {
  return contactsStore.get(id);
}

export function getContacts(organizationId: string, page = 1, limit = 20): {
  contacts: Contact[];
  total: number;
  page: number;
  pages: number;
} {
  const filtered = Array.from(contactsStore.values()).filter(
    (c) => c.organizationId === organizationId
  );

  const total = filtered.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const contacts = filtered.slice(start, start + limit);

  return { contacts, total, page, pages };
}

export function updateContact(
  id: string,
  data: Partial<Omit<Contact, 'id' | 'createdAt' | 'organizationId' | 'ownerId'>>
): Contact | null {
  const contact = contactsStore.get(id);
  if (!contact) return null;

  const updated: Contact = {
    ...contact,
    ...data,
    updatedAt: new Date(),
  };

  contactsStore.set(id, updated);
  return updated;
}

export function deleteContact(id: string): boolean {
  return contactsStore.delete(id);
}

export function deleteContactsByOrganization(organizationId: string): number {
  const before = contactsStore.size;
  Array.from(contactsStore.entries()).forEach(([id, contact]) => {
    if (contact.organizationId === organizationId) {
      contactsStore.delete(id);
    }
  });
  return before - contactsStore.size;
}

export function searchContacts(
  organizationId: string,
  query: string
): Contact[] {
  const lowerQuery = query.toLowerCase();
  return Array.from(contactsStore.values()).filter(
    (c) =>
      c.organizationId === organizationId &&
      (c.firstName.toLowerCase().includes(lowerQuery) ||
        c.lastName.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.company?.toLowerCase().includes(lowerQuery))
  );
}
