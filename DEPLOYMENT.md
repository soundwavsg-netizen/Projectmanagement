# Deployment Guide

This guide will help you deploy the Project Management Portal to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works fine)
- Your code pushed to a GitHub repository

## Step-by-Step Deployment to Vercel

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
cd /path/to/pm-app
git init
git add .
git commit -m "Initial commit - PM Portal"
git branch -M main
git remote add origin https://github.com/yourusername/pm-portal.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `pm-app` folder as the root directory

### 3. Configure Environment Variables

In the Vercel dashboard, add these environment variables:

```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-a-secure-random-string-here
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Deploy

Click "Deploy" and wait for the build to complete (usually 2-3 minutes).

### 5. Set Up Database

After first deployment:

1. In Vercel, go to your project settings
2. Find the "Deployments" tab
3. The database will be created on first run

For a production app, you should migrate to PostgreSQL. See below.

## Production Database Setup (PostgreSQL)

For production, SQLite is not recommended. Use PostgreSQL instead:

### Option 1: Vercel Postgres

1. In Vercel dashboard, go to "Storage"
2. Create a new Postgres database
3. Copy the `DATABASE_URL` to your environment variables
4. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. Run migrations:
```bash
npx prisma migrate deploy
```

### Option 2: External PostgreSQL (Railway, Supabase, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. Update `DATABASE_URL` in Vercel
4. Follow the same schema update steps as above

## Post-Deployment

### Initialize Database with Seed Data

After deploying, you'll need to seed the database:

1. Clone your repo locally
2. Update `.env` with production `DATABASE_URL`
3. Run: `npm run db:seed`

Or create a Vercel function to seed via API call (recommended for serverless).

### Create First User

The seed script creates an admin user:
- Email: admin@pmportal.com
- Password: admin123

**Important**: Change this password immediately after first login!

## Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

## Monitoring

Vercel provides built-in monitoring:
- View logs in the "Deployments" tab
- Check analytics in the "Analytics" tab
- Set up integrations for Slack/Discord notifications

## Troubleshooting

### Build Fails

Check the build logs in Vercel dashboard. Common issues:
- Missing environment variables
- TypeScript errors
- Dependency issues

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly
- For PostgreSQL, ensure connection string has `?schema=public` or similar
- Check if migrations were run

### Authentication Not Working

- Verify `NEXTAUTH_URL` matches your deployment URL (including https://)
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### API Routes Timing Out

Vercel serverless functions have a 10s timeout on free tier. For longer operations:
- Optimize database queries
- Add indexes to frequently queried fields
- Consider upgrading to Pro tier (60s timeout)

## Performance Optimization

1. **Enable Caching**:
   - Static pages are cached automatically
   - Use `revalidate` for ISR where appropriate

2. **Database Optimization**:
   - Add indexes for frequently queried fields
   - Use connection pooling (PgBouncer for PostgreSQL)

3. **Image Optimization**:
   - Next.js Image component handles this automatically

4. **Edge Functions** (Optional):
   - For ultra-low latency, move auth to Edge Runtime

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up CORS if needed
- [ ] Review API route authentication
- [ ] Enable rate limiting (consider Vercel middleware)
- [ ] Regular dependency updates (`npm audit`)

## Updating the App

To deploy updates:

```bash
git add .
git commit -m "Update description"
git push
```

Vercel will automatically deploy on push to main branch.

## Rollback

If a deployment breaks:
1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

## Cost Estimates

### Vercel Free Tier
- Suitable for: Demo, small teams (<10 users)
- Limits: 100 GB bandwidth/month, 100 serverless function executions/day
- Cost: **$0/month**

### Vercel Pro Tier
- Suitable for: Growing teams, production use
- Limits: 1 TB bandwidth, unlimited function executions
- Cost: **$20/month**

### Database Costs
- Vercel Postgres: $0.32/GB/month
- Railway: ~$5-10/month for small DB
- Supabase: Free tier available

**Total estimated cost for production**: $0-30/month

## Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

Happy deploying! 🚀
