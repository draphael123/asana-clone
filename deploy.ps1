# PowerShell script to prepare for GitHub deployment
# Run this script before pushing to GitHub

Write-Host "🚀 Preparing for GitHub deployment..." -ForegroundColor Green

# Check if git is configured
$gitEmail = git config --global user.email
$gitName = git config --global user.name

if (-not $gitEmail -or -not $gitName) {
    Write-Host "⚠️  Git user configuration not set." -ForegroundColor Yellow
    Write-Host "Please run these commands first:" -ForegroundColor Yellow
    Write-Host "  git config --global user.email 'your.email@example.com'" -ForegroundColor Cyan
    Write-Host "  git config --global user.name 'Your Name'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or set them for this repository only:" -ForegroundColor Yellow
    Write-Host "  git config user.email 'your.email@example.com'" -ForegroundColor Cyan
    Write-Host "  git config user.name 'Your Name'" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Git configured: $gitName <$gitEmail>" -ForegroundColor Green
Write-Host ""

# Check if remote exists
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📝 No GitHub remote configured yet." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To connect to GitHub, run one of these:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Create repo on GitHub first, then:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/asana-clone.git" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use GitHub CLI:" -ForegroundColor Cyan
    Write-Host "  gh repo create asana-clone --public --source=. --remote=origin --push" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Remote configured: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "To push to GitHub:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Green
Write-Host "1. Create a GitHub repository (if not done)" -ForegroundColor White
Write-Host "2. Add remote and push (see commands above)" -ForegroundColor White
Write-Host "3. Set up database (Neon/Supabase)" -ForegroundColor White
Write-Host "4. Deploy to Vercel (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host ""
Write-Host "📚 See QUICK_START.md for detailed instructions" -ForegroundColor Cyan

