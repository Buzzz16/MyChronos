# ⚠️ Vercel Deployment Troubleshooting

## Error: "Environment Variable 'DATABASE_URL' references Secret which does not exist"

This error means Vercel couldn't find the environment variables you specified.

### ❌ What Went Wrong
The `vercel.json` was trying to reference Vercel Secrets that don't exist yet.

### ✅ How to Fix

**Option 1: Redeploy with Manual Environment Variables (Recommended)**

1. Go to **Vercel Dashboard** > Your Project > **Settings** > **Environment Variables**
2. Delete any existing variables that show as "Secret" references
3. Add variables manually:
   - Click **"Add Environment Variable"**
   - Name: `DATABASE_URL`
   - Value: `postgresql://user:pass@host:6543/db?schema=public&pgbouncer=true`
   - Click **"Add"**
4. Repeat for all 5 variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_APP_URL`
5. Click **"Redeploy"** in the Deployments tab

**Option 2: Clear and Retry**

1. Go to **Vercel Dashboard** > Your Project
2. Click **"Deployments"** tab
3. Find the failed deployment
4. Click **"Redeploy"** (it will use updated vercel.json)

---

## Step-by-Step: Adding Environment Variables in Vercel

### 1. Open Vercel Settings
- Go to **vercel.com/dashboard**
- Click your project name (MyChronos)
- Click **"Settings"** tab
- Scroll to **"Environment Variables"**

### 2. Add DATABASE_URL

1. Click **"Add Environment Variable"**
2. **Name field**: Type `DATABASE_URL`
3. **Value field**: Paste your Supabase connection pooling URL
   - Get from: Supabase > Settings > Database > Connection String (with pgbouncer)
   - Format: `postgresql://user:pass@host:6543/db?schema=public&pgbouncer=true`
4. **Environments**: Check `Production`
5. Click **"Save"**

### 3. Add DIRECT_URL

1. Click **"Add Environment Variable"**
2. **Name field**: Type `DIRECT_URL`
3. **Value field**: Paste your Supabase direct connection URL
   - Get from: Supabase > Settings > Database > Connection String (without pgbouncer)
   - Format: `postgresql://user:pass@host:5432/db?schema=public`
4. **Environments**: Check `Production`
5. Click **"Save"**

### 4. Add NEXTAUTH_SECRET

1. Generate a secret locally:
   ```bash
   openssl rand -base64 32
   ```
   Or in Node.js:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Click **"Add Environment Variable"**
3. **Name field**: Type `NEXTAUTH_SECRET`
4. **Value field**: Paste the generated secret
5. **Environments**: Check `Production`
6. Click **"Save"**

### 5. Add NEXTAUTH_URL

1. Click **"Add Environment Variable"**
2. **Name field**: Type `NEXTAUTH_URL`
3. **Value field**: Your Vercel deployment URL
   - Example: `https://mychronos-app.vercel.app`
   - You can find this in Vercel > Deployments > top deployment
4. **Environments**: Check `Production`
5. Click **"Save"**

### 6. Add NEXT_PUBLIC_APP_URL

1. Click **"Add Environment Variable"**
2. **Name field**: Type `NEXT_PUBLIC_APP_URL`
3. **Value field**: Same as NEXTAUTH_URL
   - Example: `https://mychronos-app.vercel.app`
4. **Environments**: Check `Production`
5. Click **"Save"**

---

## Verify All Variables Are Set

You should now see all 5 variables in the Environment Variables section:
- ✅ `DATABASE_URL` = `postgresql://...`
- ✅ `DIRECT_URL` = `postgresql://...`
- ✅ `NEXTAUTH_SECRET` = `abc123...`
- ✅ `NEXTAUTH_URL` = `https://...vercel.app`
- ✅ `NEXT_PUBLIC_APP_URL` = `https://...vercel.app`

---

## Redeploy After Adding Variables

1. Go to **Deployments** tab
2. Find your failed deployment
3. Click the **"..."** menu
4. Click **"Redeploy"**
5. Wait for build to complete (~2-3 minutes)

---

## Other Common Errors

### Error: "NEXTAUTH_SECRET is not defined"
- Verify `NEXTAUTH_SECRET` is added to Environment Variables
- Ensure it's not empty
- Redeploy after adding

### Error: "Cannot connect to database"
- Verify `DATABASE_URL` is correct
- Check password is correct in URL
- Ensure Supabase allows Vercel IP (usually automatic)
- Try using connection pooling URL (with pgbouncer)

### Error: "Login redirects back to login"
- Verify `NEXTAUTH_URL` matches your Vercel domain
- Check `NEXTAUTH_SECRET` is set
- Ensure database is accessible

---

## Testing After Deployment

Once redeploy completes successfully:

1. Visit your Vercel URL: `https://[project-name].vercel.app`
2. Click "Sign In"
3. Try demo account:
   - Email: `demo@mychronos.app`
   - Password: `demo123`
4. You should see the dashboard
5. Try creating an agenda
6. Check everything works

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs/environment-variables
- **Supabase Connection**: https://supabase.com/docs/guides/database/connecting-to-postgres
- **Next.js Auth**: https://next-auth.js.org/deployment/vercel
