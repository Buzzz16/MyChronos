# PHASE 1 SETUP INSTRUCTIONS

## 📋 What We've Built

✅ Complete Next.js 14 project structure with TypeScript  
✅ Prisma ORM configured with Supabase PostgreSQL  
✅ Comprehensive database schema (User, Agenda, Category)  
✅ Tailwind CSS + ShadcnUI setup  
✅ Type definitions and constants  
✅ Seed data for testing  

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Install Dependencies

Open your terminal in the project folder (`d:\Chronoss`) and run:

```bash
npm install
```

This will install all required packages (~2-3 minutes).

---

### Step 2: Verify Database Connection

Your `.env` file is already configured with your Supabase credentials. Let's test the connection:

```bash
npx prisma db push
```

**Expected Output:**
```
✔ Database synchronized
✔ Generated Prisma Client
```

This command will:
- Create all tables in your Supabase database
- Generate the Prisma Client for type-safe queries

---

### Step 3: Seed Sample Data (Optional)

To populate your database with default categories and a demo user:

```bash
npm run db:seed
```

**Expected Output:**
```
🌱 Starting seed...
✅ Created 5 categories
✅ Created demo user: demo@mychronos.app
✅ Created 3 sample agendas
🎉 Seed completed successfully!
```

---

### Step 4: View Database (Optional)

To explore your database visually:

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555` where you can:
- View all tables
- Edit data manually
- Test relationships

---

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

You should see a welcome page with:
- **MyChronos** title
- "Phase 1 Complete" message
- Clean Tailwind styling

---

## 📊 Database Schema Overview

### **User Table**
```typescript
- id: Unique identifier
- email: Unique email address
- name: User's display name
- timezone: User's timezone (e.g., "Asia/Jakarta")
- city, region, country: Location data
- displayMode: DETAILED or BROAD
- notificationsEnabled: Boolean
```

### **Agenda Table**
```typescript
- id: Unique identifier
- userId: Foreign key to User
- title: Agenda title (required)
- description: Optional notes
- targetDateTime: When the agenda is scheduled
- categoryId: Foreign key to Category (optional)
- priority: LOW, MEDIUM, HIGH, URGENT
- isCompleted: Boolean
- isArchived: Boolean
```

### **Category Table**
```typescript
- id: Unique identifier
- name: Category name (e.g., "Work", "Personal")
- description: Optional description
- color: Hex color code (e.g., "#3B82F6")
- icon: Icon name (e.g., "briefcase")
```

---

## 🎯 Default Categories Created

1. **Work** (Blue) - Professional tasks
2. **Personal** (Green) - Personal errands
3. **Health & Fitness** (Red) - Exercise & wellness
4. **Learning** (Purple) - Education & skills
5. **Social** (Amber) - Social events

---

## 🔧 Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:seed` | Populate sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npx prisma generate` | Regenerate Prisma Client |

---

## ✅ Verification Checklist

Before proceeding to Phase 2, confirm:

- [ ] `npm install` completed without errors
- [ ] `npx prisma db push` successfully created tables
- [ ] `npm run dev` starts the server on port 3000
- [ ] Browser shows the MyChronos welcome page
- [ ] (Optional) Prisma Studio shows tables with seed data

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Check your internet connection
- Verify Supabase credentials in `.env`
- Ensure your Supabase project is active

### Error: "Module not found"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### Port 3000 already in use
- Kill the process: `npx kill-port 3000`
- Or use a different port: `npm run dev -- -p 3001`

---

## 📝 What's Next?

Once Phase 1 is confirmed working, we'll move to **Phase 2**:

- 🔐 Authentication setup (NextAuth.js or Clerk)
- 👤 User registration and login
- 🛡️ Protected routes and middleware
- 👨‍💼 User profile management

**Take your time to implement Phase 1 and let me know when you're ready for Phase 2!**

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Review the troubleshooting section
3. Share the specific error with me for assistance

Good luck! 🚀
