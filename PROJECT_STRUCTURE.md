# MyChronos - Project Structure

```
d:\Chronoss\
├── app/                          # Next.js 14 App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Home page
│
├── lib/                          # Core utilities and configurations
│   ├── prisma.ts                # Prisma client singleton
│   ├── constants.ts             # App-wide constants
│   └── utils.ts                 # Helper functions (cn)
│
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma            # Database models (User, Agenda, Category)
│   └── seed.ts                  # Sample data seeder
│
├── scripts/                      # Utility scripts
│   └── test-db.ts               # Database connection tester
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Shared types and interfaces
│
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                 # Example environment variables
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── PHASE_1_GUIDE.md            # Setup instructions
└── README.md                    # Project documentation
```

## 📁 Folders to be Added in Future Phases

```
├── components/                   # React components
│   ├── ui/                      # ShadcnUI components
│   ├── layout/                  # Layout components
│   └── features/                # Feature-specific components
│
├── app/api/                      # API routes (Server Actions)
│   ├── agendas/                 # Agenda CRUD endpoints
│   ├── categories/              # Category endpoints
│   ├── user/                    # User profile endpoints
│   ├── location/                # Location detection
│   └── time/                    # Server time sync
│
├── hooks/                        # Custom React hooks
│   ├── useServerTime.ts         # Server time synchronization
│   ├── useLocation.ts           # Location detection
│   ├── useCountdown.ts          # Countdown timer
│   └── useNotification.ts       # Push notifications
│
├── stores/                       # Zustand state stores
│   ├── useAppStore.ts           # Global app state
│   └── useUserStore.ts          # User preferences
│
├── services/                     # External API integrations
│   ├── worldtime.ts             # WorldTimeAPI
│   ├── nominatim.ts             # OpenStreetMap Geocoding
│   └── notifications.ts         # Browser Notification API
│
└── public/                       # Static assets
    ├── icons/                    # App icons
    ├── manifest.json             # PWA manifest
    └── sw.js                     # Service worker
```

## 🗄️ Database Schema (Current)

### **users**
- id (CUID primary key)
- email (unique)
- name
- timezone, city, region, country
- lastLatitude, lastLongitude
- displayMode (DETAILED | BROAD)
- notificationsEnabled
- createdAt, updatedAt

### **agendas**
- id (CUID primary key)
- userId (foreign key → users)
- title, description
- targetDateTime
- categoryId (foreign key → categories, optional)
- priority (LOW | MEDIUM | HIGH | URGENT)
- isCompleted, isArchived
- completedAt
- createdAt, updatedAt

### **categories**
- id (CUID primary key)
- name, description
- color (hex), icon
- createdAt, updatedAt

## 🔗 Relationships

- User → Agendas (One-to-Many, cascade delete)
- Category → Agendas (One-to-Many, set null on delete)

---

**Current Phase:** Phase 1 Complete ✅  
**Next Phase:** Authentication & User Management
