# ERP System - Progress & Architecture Documentation

## Project Overview
A modular, scalable, role-based Enterprise Resource Planning (ERP) system built using **Next.js (App Router)**, **TypeScript**, **MongoDB**, and **Mongoose**.

---

## Roles & Access Hierarchy
The system supports four distinct roles:
- `SUPER_ADMIN`: Complete system access, role assignments, user management, global configurations, audit trail. Can access all dashboards.
- `ADMIN`: Operational oversight, staff coordination, task pipelines. Access restricted to `/dashboard/admin`.
- `SALES`: Customer leads, pipeline opportunities, quotations, orders. Access restricted to `/dashboard/sales`.
- `ACCOUNT`: Financial ledgers, invoices, payments, expense receipts, balance reports. Access restricted to `/dashboard/account`.

---

## Roadmap & Implementation Status

- [x] **Phase 1: Database Setup & User Schema**
  - [x] MongoDB Connection Utility with caching for Next.js App Router HMR
  - [x] User Mongoose Model with enum validation and password hashing
  - [x] Bcrypt password encryption pre-save hook (`bcryptjs`) & credential verification methods
  - [x] Default Super Admin Seeder (`/api/seed` API Route & `npm run seed` CLI command)
  - [x] Idempotency checks to prevent duplicate Super Admins
  - [x] Comprehensive testing and verification
- [x] **Phase 2: Authentication & Middleware**
  - [x] Login page UI (`/login`) built with `react-hook-form`, `zod`, `shadcn` components, and `lucide-react`
  - [x] Credential verification via Server Actions & API routes using `bcryptjs`
  - [x] JWT token generation using `jose` library (including User ID and Role)
  - [x] Secure HTTP-only cookie storage (`auth_token`)
  - [x] Root Next.js `middleware.ts` with unauthenticated redirects and protected `/dashboard` routes
  - [x] Toast feedback notifications powered by `sonner`
  - [x] Dashboard page (`/dashboard`) displaying active session details with logout capability
- [x] **Phase 3: Super Admin User Creation Dashboard**
  - [x] Super Admin dashboard page (`/dashboard/super-admin`) with route-level role authorization
  - [x] "Create New User" tabbed UI with form validation (`react-hook-form` + `zod`)
  - [x] Role dropdown supporting `ADMIN`, `SALES`, and `ACCOUNT` assignment
  - [x] Secure Server Action (`createUserAction`) with server-side `jose` JWT role verification
  - [x] Password encryption via Mongoose pre-save `bcryptjs` hook & duplicate email protection
  - [x] Dynamic user directory view (`getAllUsersAction`) with live status and role badges
  - [x] Feedback notifications using `sonner` toasts
- [x] **Phase 4: Role-Based Dashboards & Welcome Screens**
  - [x] Dedicated dashboard routes for all roles: `/dashboard/admin`, `/dashboard/sales`, `/dashboard/account`, `/dashboard/super-admin`
  - [x] Prominent centered `<h1>` welcome headings on every role dashboard
  - [x] Dynamic login success redirection to assigned role dashboards
  - [x] Root Next.js `middleware.ts` RBAC restricting unauthorized cross-dashboard access
  - [x] Automated end-to-end HTTP verification across all roles and edge cases
- [ ] **Phase 5: Super Admin User Management (Edit, Deactivate, Role Reassignment, Audits)**

---

## Phase 1: Database Setup & User Schema (Completed)

### 1. Created Files & Directory Structure
```text
erp-system/
├── app/
│   └── api/
│       └── seed/
│           └── route.ts         # GET/POST endpoint to initialize default Super Admin
├── lib/
│   ├── mongodb.ts               # Cached Mongoose connection helper for Next.js App Router
│   └── models/
│       └── User.ts              # Re-exported User model for clean `@/lib/models/User` imports
├── models/
│   └── User.ts                  # Mongoose User Schema, Types, Hooks, and Static Methods
├── scripts/
│   └── seed.ts                  # CLI seed script runnable via `npm run seed`
├── package.json                 # Added "seed": "tsx scripts/seed.ts"
└── progress.md                  # Master project tracking & technical reference
```

### 2. Database Connection Helper (`lib/mongodb.ts`)
- Automatically resolves `process.env.MONGODB_URI` or `process.env.DATABASE_URL` from `.env.local`.
- Sets database name to `erp_system` (or `MONGODB_DB`).
- Uses global connection caching (`global.mongooseCache`) across Next.js HMR reloads.

### 3. User Schema Specification (`models/User.ts`)
- **`email`**: Required, Unique, Lowercase, Trimmed, Validated regex.
- **`username`**: Optional / Trimmed, defaults to email prefix.
- **`password`**: Required, min 6 characters, `select: false` (bcrypt-hashed via `pre('save')`).
- **`role`**: Enum (`SUPER_ADMIN`, `ADMIN`, `SALES`, `ACCOUNT`), default `SALES`.
- **`isActive`**: Boolean, default `true`.
- **Methods**: `comparePassword(candidate)`, `User.findByCredentials(identifier)`.

---

## Phase 2: Authentication & Middleware (Completed)

### 1. Created Files & Directory Structure
```text
erp-system/
├── app/
│   ├── actions/
│   │   └── auth.ts              # Server Actions for login and logout (loginAction, logoutAction)
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts     # REST login endpoint (/api/auth/login)
│   │       └── logout/
│   │           └── route.ts     # REST logout endpoint (/api/auth/logout)
│   ├── dashboard/
│   │   └── page.tsx             # Protected Dashboard route displaying session info & logout
│   ├── login/
│   │   └── page.tsx             # Login UI with react-hook-form, zod, shadcn, and sonner
│   ├── layout.tsx               # Root layout configured with Sonner <Toaster />
│   └── page.tsx                 # Root redirector (authenticated -> /dashboard, unauthenticated -> /login)
├── components/
│   ├── logout-button.tsx        # Client component invoking logout with toast feedback
│   └── ui/
│       ├── button.tsx           # shadcn Button component
│       ├── card.tsx             # shadcn Card, CardHeader, CardTitle, etc.
│       ├── input.tsx            # shadcn Input component
│       └── label.tsx            # shadcn Label component
├── lib/
│   ├── auth.ts                  # Edge-compatible JWT helpers using jose (signToken, verifyToken)
│   ├── session.ts               # HTTP-only cookie manager (setAuthCookie, clearAuthCookie, getSessionUser)
│   └── validations/
│       └── auth.ts              # Shared Zod validation schema (loginSchema)
└── middleware.ts                # Root Next.js middleware protecting routes and handling redirects
```

### 2. JWT Logic & Session Security (`lib/auth.ts`, `lib/session.ts`)
- **Library**: `jose` (HS256 algorithm). Edge Runtime and Node.js compatible.
- **Token Validity**: 24 hours.
- **Cookie Security Settings**:
  - `name`: `auth_token`
  - `httpOnly`: `true`
  - `secure`: `true` in production
  - `sameSite`: `'lax'`
  - `path`: `'/'`
  - `maxAge`: `86400` seconds (24 hours)

---

## Phase 3: Super Admin User Creation Dashboard (Completed)

### 1. Created Files & Directory Structure
```text
erp-system/
├── app/
│   ├── actions/
│   │   └── user.ts              # Server Actions: createUserAction, getAllUsersAction
│   └── dashboard/
│       └── super-admin/
│           └── page.tsx         # Super Admin portal page with role guard and directory tabs
├── components/
│   ├── create-user-form.tsx     # Form component with react-hook-form, zod, and sonner toasts
│   └── super-admin-view.tsx     # Tabbed view container: "Create New User" & "User Directory"
└── lib/
    └── validations/
        └── user.ts              # Zod validation schema: createUserSchema, USER_ASSIGNABLE_ROLES
```

### 2. Server Actions & Security Architecture (`app/actions/user.ts`)
- Strict `jose` JWT role verification on `createUserAction`.
- Validates with `createUserSchema`.
- Prevents duplicate emails and saves with bcrypt pre-save hash.
- Revalidates paths on success.

---

## Phase 4: Role-Based Dashboards & Welcome Screens (Completed)

### 1. Created Files & Directory Structure
```text
erp-system/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx             # Central route redirector to assigned role dashboard
│   │   ├── admin/
│   │   │   └── page.tsx         # Admin Dashboard with centered "Welcome Admin Team"
│   │   ├── sales/
│   │   │   └── page.tsx         # Sales Dashboard with centered "Welcome Sales Team"
│   │   ├── account/
│   │   │   └── page.tsx         # Account Dashboard with centered "Welcome Account Team"
│   │   └── super-admin/
│   │       └── page.tsx         # Super Admin Dashboard with centered "Welcome Super Admin"
│   ├── page.tsx                 # Root redirector (authenticated -> role dashboard, unauth -> /login)
│   └── login/
│       └── page.tsx             # Updated to redirect to role-specific dashboard on success
├── lib/
│   └── auth.ts                  # Added getDashboardRouteForRole & isAuthorizedForPath helpers
└── middleware.ts                # Updated with strict Role-Based Access Control (RBAC)
```

---

### 2. Complete Role-Based Routing Architecture

#### A. Role-to-Route Mapping (`getDashboardRouteForRole`)
| Role | Primary Dashboard Route | Permissions / Access Scope |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | `/dashboard/super-admin` | Unrestricted access across all dashboards (`super-admin`, `admin`, `sales`, `account`) |
| `ADMIN` | `/dashboard/admin` | Restricted strictly to `/dashboard/admin` |
| `SALES` | `/dashboard/sales` | Restricted strictly to `/dashboard/sales` |
| `ACCOUNT` | `/dashboard/account` | Restricted strictly to `/dashboard/account` |

#### B. Access Control Matrix (`isAuthorizedForPath`)
| Requesting Role | `/dashboard/super-admin` | `/dashboard/admin` | `/dashboard/sales` | `/dashboard/account` |
| :--- | :---: | :---: | :---: | :---: |
| **`SUPER_ADMIN`** | :white_check_mark: Allow | :white_check_mark: Allow | :white_check_mark: Allow | :white_check_mark: Allow |
| **`ADMIN`** | :x: Redirect to `/dashboard/admin` | :white_check_mark: Allow | :x: Redirect to `/dashboard/admin` | :x: Redirect to `/dashboard/admin` |
| **`SALES`** | :x: Redirect to `/dashboard/sales` | :x: Redirect to `/dashboard/sales` | :white_check_mark: Allow | :x: Redirect to `/dashboard/sales` |
| **`ACCOUNT`** | :x: Redirect to `/dashboard/account` | :x: Redirect to `/dashboard/account` | :x: Redirect to `/dashboard/account` | :white_check_mark: Allow |

---

### 3. Middleware RBAC Logic (`middleware.ts`)
The Edge-compatible `middleware.ts` intercepts requests and enforces:
1. **Unauthenticated Redirects**: Unauthenticated requests to `/dashboard/*` redirect to `/login?callbackUrl=...`.
2. **Authenticated Login Access**: Authenticated users accessing `/login` are automatically redirected to their role's dashboard.
3. **Root & Base Dashboard Redirect**: Visiting `/` or `/dashboard` redirects authenticated users to their specific dashboard (`/dashboard/sales`, `/dashboard/account`, etc.).
4. **Cross-Role Route Restriction**: If a user attempts to access an unauthorized route (e.g., a `SALES` user visiting `/dashboard/super-admin` or `/dashboard/account`), middleware redirects them directly to their own role dashboard.

---

### 4. Role Welcome Screens Details
Each dashboard displays a clean, centered `<h1>` welcome title alongside KPI overview cards and role badges:
- **Super Admin**: `<h1 className="text-3xl font-bold tracking-tight text-center">Welcome Super Admin</h1>`
- **Sales Team**: `<h1 className="text-3xl font-bold tracking-tight text-center">Welcome Sales Team</h1>`
- **Admin Team**: `<h1 className="text-3xl font-bold tracking-tight text-center">Welcome Admin Team</h1>`
- **Account Team**: `<h1 className="text-3xl font-bold tracking-tight text-center">Welcome Account Team</h1>`

---

### 5. Verification & Automated Testing Matrix
Executed comprehensive automated tests across all roles using `run_http_tests.mjs`:
- **Unauthenticated Redirects**:
  - `/dashboard` -> `307 Redirect` to `/login` (**PASSED**)
  - `/dashboard/super-admin` -> `307 Redirect` to `/login` (**PASSED**)
  - `/dashboard/sales` -> `307 Redirect` to `/login` (**PASSED**)
  - `/dashboard/account` -> `307 Redirect` to `/login` (**PASSED**)
  - `/dashboard/admin` -> `307 Redirect` to `/login` (**PASSED**)
- **Super Admin (`admin@erp.com`)**:
  - Logs in -> redirects to `/dashboard/super-admin` (**PASSED**)
  - Renders "Welcome Super Admin" (**PASSED**)
  - Can access `/dashboard/sales`, `/dashboard/account`, `/dashboard/admin` (**PASSED**)
- **Sales (`sales_user@erp.com`)**:
  - Logs in -> redirects to `/dashboard/sales` (**PASSED**)
  - Renders "Welcome Sales Team" (**PASSED**)
  - Accessing `/dashboard/super-admin` -> `307 Redirect` to `/dashboard/sales` (**PASSED**)
  - Accessing `/dashboard/account` -> `307 Redirect` to `/dashboard/sales` (**PASSED**)
  - Accessing `/dashboard/admin` -> `307 Redirect` to `/dashboard/sales` (**PASSED**)
  - Accessing `/login` -> `307 Redirect` to `/dashboard/sales` (**PASSED**)
- **Account (`account_user@erp.com`)**:
  - Logs in -> redirects to `/dashboard/account` (**PASSED**)
  - Renders "Welcome Account Team" (**PASSED**)
  - Accessing `/dashboard/sales` -> `307 Redirect` to `/dashboard/account` (**PASSED**)
- **Admin (`admin_user@erp.com`)**:
  - Logs in -> redirects to `/dashboard/admin` (**PASSED**)
  - Renders "Welcome Admin Team" (**PASSED**)
  - Accessing `/dashboard/super-admin` -> `307 Redirect` to `/dashboard/admin` (**PASSED**)
- **Lint & Production Build**:
  - `npm run lint` -> **0 errors / 0 warnings** (**PASSED**)
  - `npm run build` -> Next.js 16 production build succeeded with Turbopack (**PASSED**)

---

## Glassmorphism UI Redesign Plan (Reference Image Alignment)

### Visual Aesthetic Analysis of Reference Image:
1. **Atmospheric Background**: Dark, cozy, moody architectural interior featuring lush indoor plants, dark wood/slate finishes, soft window reflections, and warm ambient candlelight glow.
2. **Glass Quality**: Extreme multi-layer frosted blur (`backdrop-blur-2xl` / 32px), subtle smoke glass tint (`rgba(20, 24, 33, 0.45)`), ultra-thin crisp top/left light rim border (`1px solid rgba(255, 255, 255, 0.18)`), and deep diffuse ambient shadow.
3. **Floating Left Capsule Dock**: Floating vertical pill navigation dock (`rounded-full`), glowing neon coral/orange circle indicator (`#FF6536`) for active tab, muted white secondary icons, and bottom logout action.
4. **Main Floating Glass Canvas**: Large floating glass panel (`rounded-[32px]`) featuring top mock browser/system bar, clean titles, horizontal stat pills, spline wave chart, goal cards, user profile capsule, and textured virtual card.
5. **Color Accents**: Neon coral orange (`#FF6536`), emerald green (`#10B981`), crisp white (`#FFFFFF`), and muted silver (`rgba(255, 255, 255, 0.65)`).

---

### Phase-by-Phase Execution Plan

#### 🎨 Phase A: Design System & Atmospheric Background Foundations (Completed)
- [x] Generate / set up the high-res atmospheric cozy botanical interior background asset in `public/bg-glass.jpg`.
- [x] Configure `app/globals.css` with core Glassmorphism utility classes and custom design tokens:
  - `.glass-canvas`: Main floating glass window with 28px+ blur, subtle white border, and ambient shadow.
  - `.glass-card`: Inner frosted container cards for widgets with interactive hover.
  - `.glass-dock`: Left floating vertical pill capsule.
  - `.glass-pill`: Top horizontal metric capsules and filter buttons.
  - `.glass-input`: Translucent inputs with subtle focus glow.
  - Accent colors: Neon coral orange (`#FF6536`) and emerald accents.
- [x] Create a global layout background wrapper (`app/layout.tsx`) so the moody interior image stays fixed behind all screens.

#### 🚀 Phase B: Floating Dock Navigation & Glass Canvas Shell (Completed)
- [x] Build reusable `components/glass-dock.tsx`:
  - Left floating vertical pill capsule with glassmorphism (`.glass-dock`).
  - Dynamic route detection with glowing neon coral-orange circular pill (`#FF6536`) on the active route.
  - ERP navigation icons: Dashboard, Super Admin/Users, Analytics/Sales, Financials/Accounts, Settings, and Logout with instant toast feedback.
  - Hover tooltips and accessibility labels.
- [x] Build reusable `components/glass-shell.tsx`:
  - Top mock browser/system navigation bar with traffic light window controls, URL capsule pill (`erp.enterprise/...`), back/forward navigation, search bar, and live status pulse.
  - Header area displaying dynamic greeting, active role badge, sync indicator, and today's date.
- [x] Implemented `app/dashboard/layout.tsx` wrapping all role dashboard routes inside `GlassShell` and `GlassDock`.
- [x] Refactored all role dashboard views (`super-admin`, `sales`, `account`, `admin`) to sit seamlessly within the frosted glass canvas.
- [x] Verified with `npm run lint` (0 errors, 0 warnings) and full automated HTTP RBAC test suite (**100% Passed**).


#### 📊 Phase C: Detailed Core Widgets & Visual Components (Completed)
- [x] **Top Horizontal Stats Bar (`components/widgets/stats-capsules.tsx`)**:
  - Translucent pill capsules for Total Balance/Revenue, Earnings/Invoiced, Expenses, and Operational Capital with micro-icons and clean white typography.
  - Dynamically customized values and metrics per role (`SUPER_ADMIN`, `SALES`, `ACCOUNT`, `ADMIN`).
- [x] **Statistic Dual-Spline Chart Card (`components/widgets/spline-wave-chart.tsx`)**:
  - Smooth dual-spline wave SVG (neon coral `#ff6536` spline + white secondary curve with glowing gradient area fills).
  - Glowing active data marker with animated pulse ping and floating pill tooltip (`$42,850`).
  - Month labels (`Jan` - `Jul`), dotted horizontal gridlines, and timeframe switcher (`1M`, `6M`, `1Y`).
- [x] **Goals & Progress Cards (`components/widgets/goals-progress-card.tsx`)**:
  - "78%" Quarterly Target card with glowing neon coral gradient progress bar.
  - "97%" System Uptime & SLA card with glowing emerald progress bar.
  - "Weekly Activity" interactive 7-bar mini chart with Friday peak volume highlight and hover detection.
- [x] **Profile & Virtual Card Widget (`components/widgets/profile-virtual-card.tsx`)**:
  - Frosted user profile capsule with avatar initials, online status indicator, role badge, and quick action pill buttons (`Transfer`, `Receive`, `Invoice`).
  - Textured Virtual Debit Card Mockup (`.glass-visa-card`) with gold EMV microchip graphic, contactless wireless symbol, card balance, masked number toggle/copy, cardholder name, expiry date, and holographic VISA logo.
- [x] **Master Widget Container (`components/widgets/dashboard-widgets.tsx`)**:
  - Responsive 12-column grid layout arranging stats, wave chart, goals, and virtual card matching the reference image.
- [x] Verified with `npm run lint` (**0 errors, 0 warnings**).


#### 🏢 Phase D: Role-Based Dashboard Integration & Glass Login Screen (Completed)
- [x] **Super Admin Dashboard (`app/dashboard/super-admin/page.tsx`)**:
  - Integrated `DashboardWidgets` displaying role-tailored financial & operational metrics.
  - Centered prominent `<h1>Welcome Super Admin</h1>` preserved.
  - Embedded frosted user management controls with tabbed "Create New User" form and "User Directory" live table.
- [x] **Sales CRM Dashboard (`app/dashboard/sales/page.tsx`)**:
  - Integrated `DashboardWidgets` with sales pipeline metrics, conversion rates, and revenue wave charts.
  - Centered prominent `<h1>Welcome Sales Team</h1>` preserved.
  - Added interactive "Active Deal Pipeline" table with opportunity stages, deal values, and status badges.
- [x] **Account & Treasury Dashboard (`app/dashboard/account/page.tsx`)**:
  - Integrated `DashboardWidgets` displaying treasury balances, receivables, disbursements, and cashflow charts.
  - Centered prominent `<h1>Welcome Account Team</h1>` preserved.
  - Added "Treasury & General Ledger" table with transaction category chips, settlement statuses, and export actions.
- [x] **Admin Operations Dashboard (`app/dashboard/admin/page.tsx`)**:
  - Integrated `DashboardWidgets` displaying project milestones, SLA fulfillments, and team activity.
  - Centered prominent `<h1>Welcome Admin Team</h1>` preserved.
  - Added "Operations & Department Checkpoints" sprint review table with priority markers and completion flags.
- [x] **VisionOS Frosted Glass Login Screen (`app/login/page.tsx`)**:
  - Converted login page into a floating frosted glass card (`.glass-canvas`, `rounded-[36px]`, `backdrop-blur-3xl`).
  - Added macOS/VisionOS traffic light window dots, translucent inputs (`.glass-input`), and glowing neon coral CTA button (`glow-pill-active`).
  - Added quick-login demo pill shortcuts for each role (`Super Admin`, `Sales Lead`, `Accountant`, `Operations Admin`).
- [x] **Full Production Build Verification**:
  - Next.js 16 (Turbopack) production build passed with **0 errors, 0 warnings** across all 11 routes.

---

### Visual Polish & Exact Alignment with Reference Image (Completed)
- **Deepened Glassmorphism**:
  - Canvas background updated to deep smoky charcoal `rgba(18, 20, 28, 0.88)` with `blur(50px) saturate(210%)` to eliminate washed-out light transparency.
  - Inner cards updated to `rgba(30, 34, 46, 0.55)` with `1px solid rgba(255, 255, 255, 0.12)` borders and inner light reflections.
  - Ambient background vignette deepened to `from-black/60 via-black/45 to-black/80` for high contrast.
- **Unified Single Window Architecture (No Outer Padding)**:
  - Removed detached floating dock and wide outer padding.
  - Integrated navigation sidebar cleanly INSIDE the main glass window with a subtle vertical divider (`border-r border-white/10`).
- **Exact Widget Matching**:
  - **Top Stat Bar**: Single unified capsule pill housing `Total Balance ($678,993.98)`, `Earnings ($998,659.65)`, and `Expenses ($56,465.69)`.
  - **Statistic Wave Chart**: "Top Contributor" with Groceries cyan dot, Invest Corporate green dot, Hobbies orange dot, dual curves (orange + white), and active peak pill tooltip (`Groceries $55.42`).
  - **Goals & Savings**: "78% Build a house" and "97% House Savings" progress cards alongside "Other Savings" ($439,456.23, +53.6%, 3 vertical orange bars).
  - **Profile & VISA Card**: Avatar with "Exclusive Card" badge, 4 action icons (`Transfer`, `Receive`, `Bill`, `Top-Up`), dark textured VISA platinum card, and "Last Transaction" card ($900 Gogo Ackerman + "See all Transaction").


