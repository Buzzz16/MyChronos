# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account with repository: https://github.com/Buzzz16/MyChronos
- Vercel account (free tier available)
- Supabase PostgreSQL database configured

---

## Step 1: Connect to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Select **"Import Git Repository"**
5. Search for **"MyChronos"** repo
6. Click **"Import"**

### Option B: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## Step 2: Configure Environment Variables

In **Vercel Dashboard**, go to **Project Settings > Environment Variables** and add:

### Production Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase connection pooling URL |
| `DIRECT_URL` | Your Supabase direct connection URL |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL (e.g., `https://mychronos.vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL |

### Optional: Preview Environment Variables
Add the same variables for staging/preview deployments.

---

## Step 3: Database Configuration

### For Supabase:

1. **Get Connection String**:
   - Go to Supabase Dashboard > Project > Settings > Database
   - Copy **"Connection Pooling String"** for `DATABASE_URL`
   - Copy **"Connection String"** for `DIRECT_URL`

2. **Replace Placeholders**:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public&pgbouncer=true
   DIRECT_URL=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
   ```

3. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

---

## Step 4: Generate NextAuth Secret

Run this command locally:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste as `NEXTAUTH_SECRET` in Vercel.

---

## Step 5: Deploy

### Automatic Deployment
Simply push to main branch on GitHub:
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Vercel will automatically trigger a build and deploy.

### Manual Deployment (if needed)
```bash
vercel --prod
```

---

## Verification Checklist

After deployment, verify:

- ✅ **Home Page**: Visit your Vercel URL
- ✅ **Login Page**: `/login` should load
- ✅ **Register Page**: `/register` should load
- ✅ **Authentication**: Create account or login with demo credentials
- ✅ **Dashboard**: After login, `/dashboard` should show
- ✅ **Agendas**: Create/edit/delete agendas
- ✅ **API Routes**: 
  - `GET /api/time` returns server time
  - `POST /api/location` reverses geocodes
- ✅ **PWA**: Install prompt appears (mobile)
- ✅ **Service Worker**: Check DevTools > Application > Service Workers

---

## Performance Optimizations

Vercel automatically provides:
- ✅ Global CDN for static assets
- ✅ Edge Network caching
- ✅ Automatic builds on push
- ✅ Preview deployments for PRs
- ✅ Serverless function optimization

---

## Troubleshooting

### Database Connection Error
**Error**: `Error connecting to the database server`
**Solution**: 
- Verify `DATABASE_URL` is correct
- Check Supabase whitelist includes Vercel IPs
- Ensure `DIRECT_URL` is set correctly

### NextAuth Session Error
**Error**: `NEXTAUTH_SECRET is not configured`
**Solution**:
- Generate new secret: `openssl rand -base64 32`
- Add to Vercel environment variables
- Redeploy

### PWA/Service Worker Issues
**Error**: Service worker not registering
**Solution**:
- Clear browser cache
- Check `public/sw.js` is accessible
- Verify HTTPS is enabled (Vercel provides this by default)

### Middleware Deprecation Warning
**Note**: The project uses the latest NextAuth approach which doesn't trigger middleware warnings. The auth middleware is properly configured in `auth.ts` with proper exports.

---

## Environment-Specific URLs

| Environment | URL |
|-------------|-----|
| Development | http://localhost:3000 |
| Preview | https://[branch].mychronos.vercel.app |
| Production | https://mychronos.vercel.app |

---

## Continuous Deployment

Once deployed, every push to `main` branch on GitHub automatically:
1. Triggers Vercel build
2. Runs build command: `npm run build`
3. Generates Prisma Client: `postinstall` hook
4. Deploys to production
5. Provides deployment URL and logs

---

## Monitoring & Logs

**View Logs in Vercel Dashboard**:
- Deployments tab: See all builds and status
- Functions tab: View serverless function usage
- Analytics tab: Check request counts and performance
- Logs: Real-time logs during deployment

---

## Rollback Procedure

If deployment has issues:
1. Go to Vercel Dashboard > Deployments
2. Find previous successful deployment
3. Click **"Redeploy"** button
4. Previous version will be restored

---

## Domain Configuration (Optional)

1. Go to **Project Settings > Domains**
2. Add your custom domain (e.g., `mychronos.com`)
3. Follow DNS configuration steps
4. Update `NEXTAUTH_URL` to use custom domain

---

## Next Steps

After deployment:
- Monitor application performance
- Set up error tracking (Sentry, etc.)
- Configure analytics
- Set up automated backups for Supabase
- Monitor database usage and scaling

---

**Status**: ✅ Ready for Vercel Deployment  
**Last Updated**: January 18, 2026
