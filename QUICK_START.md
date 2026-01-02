# Quick Start Guide - GitHub & Vercel Deployment

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub

```bash
# Make sure you're in the project directory
cd "C:\Users\danie\OneDrive\Desktop\Cursor Projects\Asana Project"

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/asana-clone.git
git branch -M main
git push -u origin main
```

**Or use GitHub CLI:**
```bash
gh repo create asana-clone --public --source=. --remote=origin --push
```

### Step 2: Get a Database

**Option A: Neon (Free) - Recommended**
1. Go to https://neon.tech
2. Sign up and create a project
3. Copy the connection string

**Option B: Supabase (Free)**
1. Go to https://supabase.com
2. Create a project
3. Get connection string from Settings > Database

### Step 3: Deploy to Vercel

1. **Go to https://vercel.com** and sign in with GitHub

2. **Click "Add New..." > "Project"**

3. **Import your repository** (`asana-clone`)

4. **Configure Environment Variables:**
   ```
   DATABASE_URL=your_postgres_connection_string
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   ```

5. **Click "Deploy"**

6. **After deployment, run migrations:**
   ```bash
   # Set your production database URL
   export DATABASE_URL="your_production_database_url"
   
   # Run migrations
   npx prisma migrate deploy
   
   # (Optional) Seed database
   npm run db:seed
   ```

### Step 4: Test Your Deployment

Visit your Vercel URL and test:
- ✅ Registration
- ✅ Login
- ✅ Workspace creation
- ✅ Project creation
- ✅ Task creation

## 🔑 Generate NEXTAUTH_SECRET

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📝 Important Notes

1. **Database URL**: Must include `?sslmode=require` for production
2. **NEXTAUTH_URL**: Update after first deployment with your actual Vercel URL
3. **Migrations**: Must run `prisma migrate deploy` after first deployment
4. **Seeding**: Optional but recommended for testing

## 🐛 Troubleshooting

**Build fails?**
- Check that `DATABASE_URL` is set correctly
- Ensure build command includes `prisma generate`

**Can't connect to database?**
- Verify connection string format
- Check database allows external connections
- Ensure SSL is enabled (`?sslmode=require`)

**Authentication errors?**
- Verify `NEXTAUTH_SECRET` is set
- Update `NEXTAUTH_URL` to your actual domain

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

