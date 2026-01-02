# Deployment Guide

This guide will walk you through deploying the Asana Clone app to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- A managed PostgreSQL database (Neon, Supabase, or Vercel Postgres)

## Step 1: Deploy to GitHub

### Option A: Using GitHub CLI (Recommended)

If you have GitHub CLI installed:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Asana Clone Milestone 1"

# Create repository on GitHub and push
gh repo create asana-clone --public --source=. --remote=origin --push
```

### Option B: Manual GitHub Setup

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it `asana-clone` (or your preferred name)
   - Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)

2. **Push your code**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Asana Clone Milestone 1"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/asana-clone.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Set Up Database

You need a PostgreSQL database. Here are recommended options:

### Option A: Neon (Recommended - Free Tier Available)

1. Go to https://neon.tech
2. Sign up/login
3. Create a new project
4. Copy the connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

### Option B: Supabase

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option C: Vercel Postgres

1. In your Vercel project (after creating it), go to Storage
2. Create a Postgres database
3. Copy the connection string

## Step 3: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/login with GitHub

2. **Import your GitHub repository**
   - Click "Add New..." > "Project"
   - Select your `asana-clone` repository
   - Click "Import"

3. **Configure the project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `prisma generate && next build` (auto-filled)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=your_postgres_connection_string_here
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   ```

   To generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

   **Important**: 
   - For production, use your actual Vercel deployment URL
   - Make sure your database connection string uses SSL (`?sslmode=require`)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

## Step 4: Run Database Migrations

After deployment, you need to run migrations on your production database:

### Option A: Using Vercel CLI

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database
npm run db:seed
```

### Option B: Using Prisma Studio (for migrations)

1. Set `DATABASE_URL` in your local `.env` to your production database
2. Run `npx prisma migrate deploy`
3. (Optional) Run `npm run db:seed`

### Option C: Using a Database Management Tool

Connect to your production database and run the SQL from your migrations manually.

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`)
2. Test registration/login
3. Create a workspace
4. Create a project
5. Create tasks

## Environment Variables Reference

Here are all the environment variables you might need:

### Required for Production

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
```

### Optional (for future milestones)

```env
# Email (for magic links)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=noreply@yourdomain.com

# File Upload (S3-compatible)
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=asana-clone-uploads
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com

# Pusher (for realtime)
PUSHER_APP_ID=your-app-id
PUSHER_KEY=your-key
PUSHER_SECRET=your-secret
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=your-key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

## Troubleshooting

### Build Fails

- **Error: Prisma Client not generated**
  - Solution: The build command should include `prisma generate`
  - Check that `vercel.json` has the correct build command

- **Error: Database connection**
  - Solution: Make sure `DATABASE_URL` is set correctly in Vercel environment variables
  - Ensure your database allows connections from Vercel IPs

### Runtime Errors

- **Error: NEXTAUTH_SECRET not set**
  - Solution: Add `NEXTAUTH_SECRET` to Vercel environment variables

- **Error: Database migrations not run**
  - Solution: Run `npx prisma migrate deploy` against your production database

### Database Issues

- **Connection timeout**
  - Solution: Make sure your database allows external connections
  - Check firewall settings
  - Use connection pooling (Neon and Supabase provide this automatically)

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- Every push to `main` branch → Production
- Every push to other branches → Preview deployment

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` to your custom domain
5. Follow DNS configuration instructions

## Monitoring

- Vercel provides built-in analytics
- Check the "Deployments" tab for build logs
- Use Vercel's "Functions" tab to monitor serverless function performance

## Next Steps

After successful deployment:
1. ✅ Test all core features
2. ✅ Set up error monitoring (Sentry, etc.)
3. ✅ Configure custom domain (optional)
4. ✅ Set up CI/CD for automated testing
5. ✅ Add production database backups

## Support

If you encounter issues:
- Check Vercel deployment logs
- Check database connection
- Verify all environment variables are set
- Review the [Vercel documentation](https://vercel.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)

