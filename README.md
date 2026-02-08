# Project Management Portal

A modern web application for coordinating multi-AI workflows. Built with Next.js, Prisma, and shadcn/ui.

## Features

- **Dashboard**: Real-time overview of all projects and tasks
- **Project Management**: Create, edit, and track projects
- **Task Coordination**: Assign tasks to different AI agents (Clawdbot, Claude, ChatGPT, Gemini, etc.)
- **Activity Tracking**: Complete audit log of all project activities
- **Comments**: Team collaboration on projects
- **Authentication**: Secure login system with NextAuth.js
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

### 3. Initialize Database

```bash
# Run migrations
npx prisma migrate dev

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Login

Use the demo credentials:
- **Email**: admin@pmportal.com
- **Password**: admin123

## Database Schema

The application uses the following main models:

- **User**: Authentication and user management
- **Project**: Project information and metadata
- **Task**: Individual tasks with AI assignees
- **Comment**: Project discussions
- **Activity**: Audit log of all actions
- **File**: File attachments (prepared for future use)
- **TaskDependency**: Task relationships

## Key Components

### Pages
- `/` - Dashboard with stats and recent projects
- `/projects` - List of all projects with filters
- `/projects/[id]` - Project detail view with tasks, comments, and activity
- `/login` - Authentication page

### API Routes
- `GET/POST /api/projects` - List and create projects
- `GET/PUT/DELETE /api/projects/[id]` - Project operations
- `POST /api/projects/[id]/tasks` - Create task
- `PUT/DELETE /api/tasks/[id]` - Task operations
- `POST /api/projects/[id]/comments` - Add comment
- `GET /api/dashboard/stats` - Dashboard statistics

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` (can use SQLite initially)
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
4. Deploy!

Note: For production, consider migrating to PostgreSQL for better performance and scalability.

### Alternative Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Project Structure

```
pm-app/
├── app/
│   ├── (dashboard)/        # Protected routes
│   │   ├── page.tsx        # Dashboard
│   │   └── projects/       # Projects pages
│   ├── api/                # API routes
│   ├── login/              # Auth pages
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── navigation.tsx      # App navigation
│   ├── create-project-dialog.tsx
│   ├── create-task-dialog.tsx
│   ├── task-list.tsx
│   └── ...
├── lib/
│   ├── prisma.ts           # Database client
│   └── auth.ts             # Auth configuration
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
└── types/
    └── next-auth.d.ts      # Type definitions
```

## Customization

### Adding New AI Agents

Edit the `AI_ASSIGNEES` array in:
- `components/create-task-dialog.tsx`
- `components/edit-task-dialog.tsx`

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Update affected components

### Styling

The app uses Tailwind CSS. Customize:
- Colors and theme in `tailwind.config.ts`
- Global styles in `app/globals.css`

## Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database
npx prisma studio        # Visual database editor
npx prisma migrate dev   # Create migration
npx prisma generate      # Regenerate client
npm run db:seed          # Seed database

# Linting
npm run lint
```

## Features Roadmap

### Phase 2 (Future)
- [ ] Task dependencies visualization
- [ ] File upload/download
- [ ] Email notifications
- [ ] Client portal (read-only access)
- [ ] Export reports (PDF)
- [ ] Time tracking charts
- [ ] WebSocket real-time updates
- [ ] Dark mode

## Contributing

This is a demo project built as a proof-of-concept for multi-AI workflow coordination. Feel free to fork and adapt for your needs!

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ by Emergent AI Coordination**
