# CRM Solution

Modern, eye-catching Customer Relationship Management (CRM) platform built with Next.js, designed for seamless customer management, sales pipeline tracking, and analytics.

## 🎯 Features

### Core Functionality
- **Customer Management**: Complete contact management with custom fields, notes, and activity tracking
- **Sales Pipeline**: Visual Kanban board for deal management across multiple stages
- **Lead Management**: Lead scoring, source tracking, and conversion workflows
- **Activity Tracking**: Email, calls, meetings, and tasks with smart scheduling
- **Analytics Dashboard**: Real-time KPIs, conversion rates, and revenue metrics
- **Communication Hub**: Integrated email templates and mass communication

### Design & UX
- 🎨 Modern, gradient-based dark mode support
- ⚡ Responsive design optimized for all devices
- 🎬 Smooth animations and transitions
- 🌙 Beautiful Tailwind CSS styling with custom color palette
- ♿ Full accessibility support (WCAG 2.1 AA)

### Technical Excellence
- 🔐 Enterprise-grade authentication & RBAC
- 🗄️ PostgreSQL with Prisma ORM
- 🚀 Server-side rendering with Next.js 15
- 📱 Mobile-first responsive design
- 🔄 Real-time updates with React Query
- 🧪 Comprehensive testing (Unit, Integration, E2E)
- 📊 Built-in observability and monitoring

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **State Management** | TanStack Query, Zustand |
| **Forms** | React Hook Form, Zod validation |
| **Database** | PostgreSQL, Prisma ORM |
| **Authentication** | NextAuth.js with JWT |
| **UI Components** | Lucide Icons, Framer Motion |
| **Charts** | Recharts for analytics |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Deployment** | Vercel (Frontend), Azure/AWS (Backend) |

## 📋 Project Structure

```
crm-solution/
├── app/                       # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   ├── (dashboard)/          # Protected dashboard routes
│   ├── api/                  # API endpoints & server actions
│   └── layout.tsx            # Root layout
├── src/
│   ├── components/           # Reusable React components
│   │   ├── ui/              # Base UI components
│   │   ├── common/          # Shared components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── forms/           # Form components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & helpers
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth utilities
│   │   ├── db.ts            # Database client
│   │   └── validators.ts    # Zod schemas
│   ├── services/            # API service layer
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   ├── styles/              # CSS & Tailwind config
│   └── utils/               # Helper functions
├── prisma/
│   ├── schema.prisma        # Data model
│   ├── migrations/          # DB migrations
│   └── seed.ts              # Database seed script
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.mjs          # Next.js config
└── tailwind.config.ts       # Tailwind CSS config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL 13+
- Git

### Local Development

1. **Clone & Install**
```bash
git clone <repo-url>
cd crm-solution
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL, NEXTAUTH_SECRET, etc.
```

3. **Database Setup**
```bash
npx prisma migrate dev --name init
npm run seed
```

4. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your CRM.

### Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma migrate dev   # Create & apply migration
npx prisma studio       # Open Prisma Studio
npm run seed            # Seed database with sample data

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run e2e             # Run E2E tests
```

## 🎨 Design System

### Color Palette
- **Primary**: Sky Blue (`#0ea5e9`) - Main brand color
- **Success**: Green (`#22c55e`) - Positive actions
- **Warning**: Amber (`#eab308`) - Cautions
- **Danger**: Red (`#ef4444`) - Destructive actions
- **Neutral**: Gray scales - UI elements

### Component Library
Built on shadcn/ui with Tailwind CSS:
- Buttons (solid, outline, ghost variants)
- Forms (inputs, selects, date pickers)
- Cards (clean, modern layouts)
- Modals (dialog & sheet components)
- Tables (sortable, filterable)
- Charts (analytics visualizations)
- Badges & Tags (status indicators)
- Loading states & skeletons

## 🔐 Authentication & Security

### Authentication Flow
1. User registers/logs in with email
2. JWT token issued and stored in httpOnly cookie
3. Middleware validates session on protected routes
4. Role-based access control (RBAC) enforced

### Security Features
- ✅ Password hashing with bcryptjs
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ CSRF protection via NextAuth
- ✅ XSS protection via React escaping
- ✅ Rate limiting on API endpoints
- ✅ Audit logging for sensitive operations
- ✅ Column-level encryption for PII

## 📊 Database Schema

### Core Entities
- **User**: System users with roles
- **Organization**: Company/account management
- **Contact**: Customer contact records
- **Lead**: Sales leads with scoring
- **Deal**: Sales opportunities & pipeline
- **Activity**: Communications & tasks
- **Note**: Rich notes on records

### Relationships
- One organization has many users, contacts, leads, deals
- One contact can have multiple leads, deals, activities
- One deal belongs to one contact, assigned to one user
- Activities link contacts, leads, or deals

## 🧪 Testing Strategy

### Unit Tests (`vitest`)
```bash
npm run test
```
- React components
- Utility functions
- API handlers

### Integration Tests
- API route testing
- Database operations
- Authentication flows

### E2E Tests (`playwright`)
```bash
npm run e2e
```
- User signup & login
- Create/edit contacts
- Deal pipeline workflows
- Report generation

## 📈 Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Database Indexing**: Strategic indexes on frequently queried columns
- **Caching**: Server-side caching for aggregations
- **Pagination**: Efficient data loading with cursor-based pagination
- **Compression**: Gzip compression on all responses

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub and connect to Vercel
# Environment variables automatically managed
npm run build
```

### Azure App Service
```bash
az webapp deployment source config-zip
```

### Docker
```bash
docker build -t crm-solution .
docker run -p 3000:3000 crm-solution
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/crm

# Authentication
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# API
API_URL=http://localhost:3000/api

# Optional Services
SENTRY_DSN=https://...
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Component Guide](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

### Code Standards
- TypeScript strict mode
- ESLint enforced
- Prettier formatting
- 80%+ test coverage
- Clear commit messages

## 📝 License

MIT License - feel free to use this for your projects.

## 🙋 Support

For issues, questions, or suggestions:
1. Check existing issues
2. Create detailed bug reports
3. Include screenshots/videos for UI issues
4. Follow the issue template

## 🎯 Roadmap

### Phase 1: MVP (Weeks 1-2)
- [x] Project setup & database
- [x] Auth & RBAC
- [ ] Customer CRUD & UI
- [ ] Basic pipeline

### Phase 2: Core Features (Weeks 3-4)
- [ ] Activity tracking
- [ ] Pipeline Kanban
- [ ] Basic reporting

### Phase 3: Advanced (Weeks 5-6)
- [ ] Analytics dashboard
- [ ] Integrations
- [ ] Automation

### Phase 4: Polish (Weeks 7-8)
- [ ] Full testing coverage
- [ ] Performance optimization
- [ ] Production hardening

---

**Built with ❤️ for modern sales teams**
