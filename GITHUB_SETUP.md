# GitHub Setup Instructions

## Before You Commit

Git needs to know who you are. Run these commands:

```powershell
# Set your email and name (replace with your actual info)
git config user.email "your.email@example.com"
git config user.name "Your Name"

# Or set globally for all repositories
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

## Push to GitHub

### Option 1: Using GitHub CLI (Easiest)

```powershell
# Install GitHub CLI if you don't have it: winget install GitHub.cli

# Create repo and push in one command
gh repo create asana-clone --public --source=. --remote=origin --push
```

### Option 2: Manual Setup

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name: `asana-clone`
   - Choose Public or Private
   - **Don't** initialize with README (we already have one)

2. **Connect and push**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/asana-clone.git
   git branch -M main
   git push -u origin main
   ```

## After Pushing

Once your code is on GitHub, you can:
1. Deploy to Vercel (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. Set up CI/CD (GitHub Actions workflow is included)
3. Share with your team

## Verify

Check your repository at:
`https://github.com/YOUR_USERNAME/asana-clone`

