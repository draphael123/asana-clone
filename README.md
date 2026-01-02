# Asana Clone - Project Management App

A full-featured project management application built with Next.js 14+, TypeScript, Prisma, and PostgreSQL. This app replicates the core functionality of Asana with a modern, clean UI.

## Features

### Milestone 1 (✅ Complete)
- ✅ Authentication (NextAuth with email/password)
- ✅ Workspace and Team creation
- ✅ Project CRUD operations
- ✅ Task CRUD operations
- ✅ List view with sections
- ✅ Task assignees and due dates
- ✅ Comments on tasks
- ✅ Basic workspace permissions

### Upcoming Milestones
- Milestone 2: Board (Kanban) view with drag-and-drop
- Milestone 3: Inbox/Notifications with realtime updates
- Milestone 4: Timeline (Gantt-lite) view
- Milestone 5: Global search, advanced filters, and polish

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth (Auth.js)
- **State Management**: Zustand (where needed)
- **Data Fetching**: React Query (TanStack Query)
- **Drag & Drop**: @dnd-kit/core (for future milestones)
- **Realtime**: Pusher (for future milestones)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Docker and Docker Compose (for local PostgreSQL)
- PostgreSQL 15+ (or use Neon/Supabase for production)

## Getting Started

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and configure:

```env
# Database - use the docker-compose postgres or your own
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/asana_clone?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Generate a secret:
# openssl rand -base64 32
```

### 3. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This starts a PostgreSQL container on port 5432.

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database with demo data
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Login

Use the seeded demo accounts:
- **Email**: `alice@example.com` or `bob@example.com`
- **Password**: `password123`

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── app/               # Main app pages
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                   # Utilities and helpers
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Database Schema

The app uses a comprehensive Prisma schema with:

- **Users**: Authentication and user profiles
- **Workspaces**: Top-level organizations
- **Teams**: Groups within workspaces
- **Projects**: Project containers
- **Tasks**: Individual tasks with subtasks support
- **Sections**: For list view organization
- **Columns**: For board view organization
- **Comments**: Task comments
- **Notifications**: User notifications
- **EventLog**: Audit trail

See `prisma/schema.prisma` for the full schema.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Quick Deployment Guide

See [QUICK_START.md](./QUICK_START.md) for a 5-minute deployment guide.

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

### Vercel Deployment Steps

1. **Push to GitHub**
   ```bash
   # Configure git (if not done)
   git config user.email "your.email@example.com"
   git config user.name "Your Name"
   
   # Create GitHub repo and push
   gh repo create asana-clone --public --source=. --remote=origin --push
   # OR manually: git remote add origin https://github.com/YOUR_USERNAME/asana-clone.git
   ```

2. **Set up Database** (Neon/Supabase recommended)
   - Get connection string with `?sslmode=require`

3. **Deploy to Vercel**
   - Import GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (your Vercel URL)
     - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Database Options

- **Neon**: Serverless Postgres (recommended for Vercel)
- **Supabase**: Open-source Firebase alternative
- **Railway**: Simple Postgres hosting
- **Vercel Postgres**: Vercel's managed Postgres

## Development Notes

### Server Actions vs API Routes

This project uses **Server Actions** for mutations and data fetching. Server Actions are:
- Type-safe end-to-end
- Simpler than API routes
- Integrated with Next.js App Router
- Automatically handle form submissions

### Multi-Tenant Security

All queries are scoped to workspaces. The `requireWorkspaceAccess` and `requireProjectAccess` helpers ensure users can only access data from workspaces they belong to.

### Validation

All inputs are validated using Zod schemas on both client and server for security and type safety.

## Known Limitations

- Board view and drag-and-drop: Coming in Milestone 2
- Timeline view: Coming in Milestone 4
- Realtime updates: Coming in Milestone 3
- Global search: Coming in Milestone 5
- File attachments: Basic structure in place, S3 integration needed
- Advanced filters: Coming in Milestone 5

## Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive error handling
- Implementing rate limiting
- Adding comprehensive tests
- Setting up CI/CD
- Adding monitoring and logging
- Implementing file upload to S3
- Adding email notifications

## License

MIT

