# MyChronos - Personal Productivity Web Application

A robust, desktop-first (mobile-optimized) web app for managing agendas with precise time-tracking and location-based contexts.

## 🎯 Tech Stack

- **Framework:** Next.js 14+ (App Router, Server Actions)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Styling:** Tailwind CSS + ShadcnUI
- **State Management:** React Query + Zustand
- **Date Handling:** date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (already configured)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Prisma and Database:**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to database (creates tables)
   npx prisma db push
   
   # (Optional) Open Prisma Studio to view database
   npx prisma studio
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### User
- Location tracking (city, region, timezone)
- Display preferences
- Notification settings

### Agenda
- Title, description, target date/time
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Category association
- Completion status

### Category
- Name, color, icon
- Reusable across multiple agendas

## 🌐 External APIs Used

1. **WorldTimeAPI** - Server time synchronization
2. **Nominatim (OpenStreetMap)** - Reverse geocoding
3. **Geolocation API** - Browser location detection
4. **Notification API** - Push notifications

## 📝 Development Phases

- [x] **Phase 1:** Setup & Database Architecture
- [ ] **Phase 2:** Authentication & User Management
- [ ] **Phase 3:** Server Time Sync & Location Detection
- [ ] **Phase 4:** Agenda CRUD & Countdown Engine
- [ ] **Phase 5:** PWA & Service Workers
- [ ] **Phase 6:** UI/UX Polish & Responsiveness

## 📄 License

Private project for personal use.
