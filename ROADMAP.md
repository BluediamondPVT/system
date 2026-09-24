# — Complete Dynamic Architecture Roadmap 🚀

> **Target Goal**: Transform the current static/mock prototype into a 100% dynamic, production-ready, database-backed enterprise real estate ERP with automated multi-channel lead ingestion (Meta Ads, Google Ads, Website Forms, Privyr/Webhooks) at **ZERO extra software cost**.

---

## 📑 Table of Contents
1. [Core Architectural Blueprint](#1-core-architectural-blueprint)
2. [Database Schema Architecture (MongoDB & Mongoose)](#2-database-schema-architecture-mongodb--mongoose)
3. [Deep Dive: Multi-Channel Lead Ingestion (100% FREE)](#3-deep-dive-multi-channel-lead-ingestion-100-free)
   - [Meta Ads (Facebook & Instagram Lead Forms)](#31-meta-ads-facebook--instagram-lead-generation)
   - [Google Ads (Lead Form Extensions)](#32-google-ads-lead-form-extensions)
   - [Website Landing Pages & Ingestion API](#33-website-landing-pages--custom-forms)
   - [Privyr & Third-Party Webhook Sync](#34-privyr--third-party-webhook-sync)
4. [Phase-by-Phase Modular Execution Roadmap](#4-phase-by-phase-modular-execution-roadmap)
   - [Phase 1: Project Master & Global Context Engine](#phase-1-project-master--global-context-engine)
   - [Phase 2: Dynamic Stacking Plan & Architectural Inventory](#phase-2-dynamic-stacking-plan--architectural-inventory)
   - [Phase 3: Lead CRM & Multi-Channel Ingestion Hub](#phase-3-lead-crm--multi-channel-ingestion-hub)
   - [Phase 4: Quotation & MahaRERA Cost Sheet Engine](#phase-4-quotation--maharera-cost-sheet-engine)
   - [Phase 5: Escrow Accounts, MahaRERA Demands & Society Ledger](#phase-5-escrow-accounts-maharera-demands--society-ledger)
   - [Phase 6: Real-time WebSockets, Audit Logs & Performance Polish](#phase-6-real-time-websockets-audit-logs--performance-polish)
5. [Summary: Free Tools vs Paid Services Comparison](#5-summary-free-tools-vs-paid-services-comparison)

---

## 1. Core Architectural Blueprint

Currently, the user interface and glassmorphic aesthetic are completely in place. However, the data currently lives in client memory / mock files (`lib/ashapura-data.ts`).

To make the system fully dynamic:
```
┌────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL LEAD SOURCES                           │
│  Meta Ads (FB/Insta)  │  Google Ads Forms  │  Websites  │  Walk-ins    │
└───────────┬───────────────────┬───────────────────┬────────────┬───────┘
            │ Webhook           │ Webhook           │ API/Form   │ Manual
            ▼                   ▼                   ▼            ▼
┌────────────────────────────────────────────────────────────────────────┐
│               NEXT.JS INGESTION HUB (/api/webhooks/*)                  │
│  - Payload Validation & Normalization (Zod)                            │
│  - Anti-Spam & Duplicate Check (Mobile + Email)                        │
│  - Project Association & Round-Robin Sales Rep Assignment              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MONGODB ENTERPRISE DATABASE                        │
│  [Users]  │  [Projects]  │  [InventoryUnits]  │  [Leads]  │  [Demands] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER + SERVER ACTIONS                 │
│  Server Components (RSC) + Cached Revalidation (revalidatePath)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  FROSTED GLASSMORPHISM UI DASHBOARD                    │
│  Top Header Context │ Stacking Matrix │ CRM Table │ Quotes │ Accounts  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Architecture (MongoDB & Mongoose)

We will create 5 primary MongoDB models in the `models/` directory:

### 2.1. `Project.ts` (Projects Master)
```typescript
{
  slug: string;                 // unique slug e.g. "meghmala-crysta"
  name: string;                 // "Meghmala Crysta"
  tag: 'CHSL' | 'SRA' | 'JV' | 'Free-Sale';
  location: string;             // "Malad West, Mumbai"
  zone: string;                 // "Western Suburbs"
  totalFloors: number;          // 15
  wings: string[];              // ["Wing A", "Wing B"]
  basePricePerSqft: number;     // 23500
  rehabMembers: number;         // 20 (for CHSL)
  freeSaleUnits: number;        // 130
  reraNumber: string;           // "P51800028914"
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  amenities: string[];
  bankEscrowAccount: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  isActive: boolean;
}
```

### 2.2. `InventoryUnit.ts` (Stacking Plan / Flat Matrix)
```typescript
{
  projectId: ObjectId (ref: 'Project');
  wing: string;                 // "Wing A"
  floor: number;                // 15
  unitNumber: string;           // "1501"
  typology: '1BHK' | '2BHK' | '3BHK' | 'JODI';
  carpetAreaSqft: number;       // 740
  basePricePerSqft: number;     // 23500
  status: 'Available' | 'Hold' | 'Booked' | 'JV' | 'Rehab';
  holdDetails?: {
    tokenAmount: number;
    tokenDate: Date;
    prospectName: string;
    prospectPhone: string;
    heldByUserId: ObjectId (ref: 'User');
    expiryDate: Date;
  };
  bookedDetails?: {
    buyerName: string;
    agreementValue: number;
    bookingDate: Date;
    allotmentLetterUrl?: string;
  };
}
```

### 2.3. `Lead.ts` (Central CRM Pipeline)
```typescript
{
  name: string;
  phone: string;                // Normalized E.164 format (+91...)
  email?: string;
  projectId?: ObjectId (ref: 'Project');
  preferredTypology?: string;   // "2 BHK"
  budgetMin?: number;
  budgetMax?: number;
  stage: 'NEW' | 'CONTACTED' | 'VISIT PLANNED' | 'NEGOTIATION' | 'BOOKED' | 'LOST';
  source: 'Meta Ads' | 'Google Ads' | 'Website' | 'Walk-in Malad HO' | 'Channel Partner' | 'Privyr';
  campaignDetails?: {
    campaignName?: string;
    adSet?: string;
    adName?: string;
    leadgenId?: string;         // Meta lead ID
    formId?: string;
  };
  assignedTo?: ObjectId (ref: 'User'); // Sales representative
  notes: Array<{
    text: string;
    createdBy: ObjectId (ref: 'User');
    createdAt: Date;
  }>;
  siteVisits: Array<{
    scheduledDate: Date;
    conductedBy?: ObjectId (ref: 'User');
    status: 'Scheduled' | 'Completed' | 'No-Show';
    feedback?: string;
  }>;
  status: 'Active' | 'Archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.4. `Quotation.ts` (MahaRERA Cost Sheets)
```typescript
{
  quotationNumber: string;      // "AB/QUOT/2026/0142"
  projectId: ObjectId (ref: 'Project');
  unitId?: ObjectId (ref: 'InventoryUnit');
  unitNumber: string;
  buyerName: string;
  buyerPhone?: string;
  carpetAreaSqft: number;
  baseRatePerSqft: number;
  floorRiseCharges: number;
  parkingCharges: number;
  agreementValue: number;
  stampDutyPercent: number;     // 6%
  stampDutyAmount: number;
  registrationFee: number;      // 30000
  gstPercent: number;           // 5%
  gstAmount: number;
  grandTotal: number;
  issuedBy: ObjectId (ref: 'User');
  validUntil: Date;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
}
```

### 2.5. `DemandLedger.ts` (MahaRERA Escrow & Society Transit Rent)
```typescript
{
  noticeCode: string;           // "D001"
  projectId: ObjectId (ref: 'Project');
  unitNumber: string;
  allotteeName: string;
  allotteePhone?: string;
  category: 'Milestone Collection' | 'CHSL Hardship Rent' | 'Plinth Level' | 'Slab Casting';
  isHardshipAllowance: boolean;
  milestoneScope: string;       // "3rd Slab Casting (MahaRERA 35%)"
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidDate?: Date;
  paymentRef?: string;          // Cheque / RTGS UTR number
  dispatched: boolean;
  dispatchedAt?: Date;
}
```

---

## 3. Deep Dive: Multi-Channel Lead Ingestion (100% FREE)

You asked: **"Ye sab data meta se, google ads se, website se ayega like privyr... wo kaise ayega, kon konsi external service leni pad sakti hai, or koshish yahi hai ki free me kaam ho jaye"**.

Here is the exact, zero-cost architecture without paying for Zapier or Privyr subscriptions!

### 3.1. Meta Ads (Facebook & Instagram Lead Generation)
When a buyer clicks on an Instagram/Facebook Ad and fills out the "Instant Lead Form", Meta has a native **Webhooks API** that can send the lead instantly to your Next.js application for **₹0 (completely FREE)**.

#### How It Works:
1. **Webhook Endpoint in Next.js**:
   We will create `app/api/webhooks/meta/route.ts`:
   - `GET` method: Meta sends a verification request with a `hub.challenge` and your secret `hub.verify_token`. Next.js replies with `hub.challenge` to verify ownership.
   - `POST` method: Meta sends a JSON payload whenever a user submits a lead form.
2. **Payload Processing**:
   The webhook receives:
   ```json
   {
     "entry": [{
       "changes": [{
         "value": {
           "leadgen_id": "18293719283712",
           "form_id": "981273918237",
           "page_id": "10293810293",
           "created_time": 1727102400
         }
       }]
     }]
   }
   ```
3. **Retrieving Form Answers**:
   Our Next.js server calls Meta Graph API:
   `https://graph.facebook.com/v21.0/{leadgen_id}?access_token={PAGE_ACCESS_TOKEN}`
   Which returns:
   - Full Name: *"Rajesh Patel"*
   - Phone Number: *"+919876543210"*
   - Interested Project: *"Meghmala Crysta"*
   - Budget: *"1.85 Cr"*
4. **Auto-Saved to MongoDB**:
   The lead is saved directly to `Lead` collection with `source: 'Meta Ads'`, and an instant notification or WhatsApp trigger is generated!
5. **Cost**: **₹0.00**. No Zapier ($29/month) or Make ($10/month) required!

---

### 3.2. Google Ads (Lead Form Extensions)
Google Ads has a built-in feature called **Webhook Integration** for lead form extensions.

#### How It Works:
1. When configuring a Lead Form in Google Ads (Search or Performance Max Campaign):
   - Scroll to **"Lead delivery options"** -> Click **"Export leads using a webhook"**.
   - **Webhook URL**: Enter your ERP URL: `https://your-domain.com/api/webhooks/google`
   - **Key**: Enter a custom secret key (e.g. `google_ashapura_lead_secret_2026`).
2. When a user submits the Google form on Google Search:
   Google immediately sends a POST request with the user's name, email, phone number, and city.
3. Our Next.js endpoint `app/api/webhooks/google/route.ts`:
   - Validates the secret key.
   - Parses the lead data.
   - Inserts it into MongoDB `Lead` collection with `source: 'Google Ads'`.
4. **Cost**: **₹0.00** (Native Google Ads feature).

---

### 3.3. Website Landing Pages & Custom Forms
If you have project landing pages (e.g., for *Amar CHSL* or *Meghmala Crysta*):

#### How It Works:
1. We build an API endpoint: `app/api/leads/ingest/route.ts` with CORS allowed for your domain.
2. Any HTML form or React landing page simply does a `fetch()` POST with:
   ```json
   {
     "name": "Amit Sharma",
     "phone": "9820012345",
     "projectId": "meghmala-crysta",
     "typology": "2 BHK",
     "source": "Website"
   }
   ```
3. The endpoint checks for duplicates (if phone already exists, it logs a new inquiry without creating duplicate clutter), creates the lead, and assigns it to a sales executive.
4. **Cost**: **₹0.00** (Direct Next.js API).

---

### 3.4. Privyr & Third-Party Webhook Sync
If sales agents are already accustomed to using **Privyr** on their mobile phones:
- Privyr has an **Integrations -> Webhook** option.
- You can either:
  1. Have Privyr forward leads to our Next.js webhook: `https://your-domain.com/api/webhooks/privyr`.
  2. **OR BETTER YET**: Our ERP completely replaces Privyr! Since our CRM already includes direct 1-click WhatsApp buttons (`https://wa.me/91...`), direct phone dialing, and real-time lead ingestion, you won't need to pay for Privyr ($15-$30/agent/month) at all!

---

## 4. Phase-by-Phase Modular Execution Roadmap

To make implementation effortless, reliable, and completely bug-free, we divide the work into **6 bite-sized phases**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 1: Project Master & Global Context Engine                       │
│  Phase 2: Dynamic Stacking Plan & Architectural Inventory              │
│  Phase 3: Lead CRM & Multi-Channel Ingestion Hub (Meta + Google Ads)  │
│  Phase 4: Quotation & MahaRERA Cost Sheet Engine                       │
│  Phase 5: Escrow Accounts, MahaRERA Demands & Society Ledger           │
│  Phase 6: Real-time WebSockets, Audit Logs & Performance Polish        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Project Master & Global Context Engine ✅ [COMPLETED]
**Objective**: Move the Ashapura Projects from static arrays into MongoDB with full CRUD.

- **Completed Tasks**:
  1. [x] Created Mongoose model: `models/Project.ts`.
  2. [x] Created Server Actions in `app/actions/project.ts`:
     - `getAllProjectsAction()`
     - `getProjectBySlugAction(slug)`
     - `createProjectAction(data)`
     - `updateProjectAction(id, data)`
  3. [x] Created Project Seed Script (`scripts/seed-projects.ts`) to populate projects into MongoDB Atlas.
  4. [x] Connected `RegisterProjectModal` to real-time GDV calculations and MongoDB creation.
  5. [x] Clean zero-state when creating new projects with zero dummy values.

---

### Phase 2: Dynamic Stacking Plan & Architectural Inventory ✅ [COMPLETED]
**Objective**: Real-time flat availability, hold tokens, and wing switching backed by MongoDB Atlas.

- **Completed Tasks**:
  1. [x] Created Mongoose model: `models/InventoryUnit.ts`.
  2. [x] Created Server Actions in `app/actions/inventory.ts`:
     - `getInventoryByProjectAction(projectId, wing)`
     - `holdUnitAction(unitId, tokenData)`
     - `releaseUnitAction(unitId)`
     - `bookUnitAction(unitId, bookingData)`
     - `createInventoryUnitAction(unitData)`
  3. [x] Database reset & verified: clean 20 units for Meghmala Crysta.
  4. [x] Fully modularized inventory architecture into `components/inventory/`:
     - `inventory-header.tsx`
     - `inventory-stat-cards.tsx`
     - `inventory-filter-bar.tsx`
     - `inventory-grid.tsx`
     - `unit-action-modal.tsx`
  5. [x] Clean zero-state for new projects: "+ Add First Flat" button.

---

### Phase 2.5: Role-Based Access Control (RBAC) & Authority Enforcement (Option A) ✅ [COMPLETED]
**Objective**: Strict role segregation and UI personalization across `SUPER_ADMIN`, `ADMIN`, `SALES`, and `ACCOUNT`.

- **Completed Tasks**:
  1. [x] **Route Authority & Middleware Protection (`lib/auth.ts`, `middleware.ts`)**:
     - All authenticated roles land at `/dashboard` (Executive Master Dashboard).
     - `/dashboard/users` strictly restricted to `SUPER_ADMIN`.
     - `/dashboard/accounts` blocked for `SALES` (redirected + client access restricted guard).
     - `/dashboard/leads` blocked for `ACCOUNT` (redirected + client access restricted guard).
     - Legacy routes (`/dashboard/sales`, `/dashboard/account`, etc.) redirected to unified `/dashboard`.
  2. [x] **Executive Dashboard Personalization (`components/executive-dashboard-view.tsx`)**:
     - Tailored banner titles, subtitles, and operations desk badges for all 4 roles.
     - Role-specific Quick Action Bar (4 direct shortcut pills per role).
     - 4 tailored KPI Summary Cards:
       - `SUPER_ADMIN`: Live Sites, Total Units, Milestone Collections (₹18.42 Cr), Active Leads (312).
       - `ADMIN`: Active Sites, Stacking Capacity, Site Visits, Milestone Collections.
       - `SALES`: Active Prospects, Scheduled Visits, Active Token Holds, Confirmed Bookings.
       - `ACCOUNT`: Escrow Inflow (₹18.42 Cr), Pending Demands (₹46 L), Society Rent Outflow (₹18 L), MahaRERA Compliance (100%).
     - "+ Register New Project" button strictly visible to `SUPER_ADMIN`.
  3. [x] **Top Header Customization (`components/top-header.tsx`)**:
     - Distinct role badges, gradient avatars (`AB`, `PA`, `SE`, `AF`), and active desk indicators.
     - Project registration trigger only visible to `SUPER_ADMIN`.
  4. [x] **Navigation Dock Segregation (`components/glass-dock.tsx`)**:
     - `Lead CRM`: Visible only to `SUPER_ADMIN`, `ADMIN`, `SALES`.
     - `Accounts & Demands`: Visible only to `SUPER_ADMIN`, `ADMIN`, `ACCOUNT`.
     - `User & Roles`: Visible only to `SUPER_ADMIN`.
  5. [x] **Inventory Matrix Authority Enforcement (`components/inventory/`)**:
     - `+ Add Flat`: Visible and executable only by `SUPER_ADMIN` and `ADMIN`.
     - `ACCOUNT` desk: Read-Only billing verification mode (banner displayed, hold/book buttons disabled, quotation export active).
     - `SALES` desk: Token advance hold and booking active; cancel booking restricted to `ADMIN`/`SUPER_ADMIN`.
     - Server Actions in `app/actions/inventory.ts` enforce role checks.

---

### Phase 3: Lead CRM & Multi-Channel Ingestion Hub
**Objective**: Connect the CRM table to MongoDB and build the zero-cost automated webhook endpoints.

- **Tasks**:
  1. Create Mongoose model: `models/Lead.ts`.
  2. Create Server Actions in `app/actions/lead.ts`:
     - `getLeadsAction(filterParams)`
     - `createLeadAction(data)`
     - `updateLeadStageAction(leadId, stage)`
     - `addLeadNoteAction(leadId, note)`
     - `deleteLeadAction(leadId)`
  3. Build Free Multi-Channel Webhook API routes:
     - `app/api/webhooks/meta/route.ts` (Facebook/Instagram lead form integration).
     - `app/api/webhooks/google/route.ts` (Google Ads lead extension).
     - `app/api/leads/ingest/route.ts` (Website forms API).
  4. Connect `app/dashboard/leads/page.tsx` to MongoDB:
     - `+ Ingest Walk-In / Ad Lead` saves to database.
     - Changing stage (e.g. `NEW` -> `VISIT PLANNED`) updates database in real time.
     - Direct WhatsApp (`wa.me`) and Call links pull live phone numbers.
  5. Test: Sending a mock lead via cURL/Postman instantly appears in the CRM table.

---

### Phase 4: Quotation & MahaRERA Cost Sheet Engine
**Objective**: Save, retrieve, and manage generated MahaRERA cost sheets.

- **Tasks**:
  1. Create Mongoose model: `models/Quotation.ts`.
  2. Create Server Actions in `app/actions/quotation.ts`:
     - `saveQuotationAction(data)`
     - `getQuotationsByProjectAction(projectId)`
     - `getQuotationByIdAction(id)`
  3. Update `app/dashboard/documents/page.tsx`:
     - Auto-fetch active project base rate, carpet area, and RERA registration number from DB.
     - Add "Save Quotation to Ledger" button.
     - Keep print-ready view (`window.print()`).
  4. Test: Generating a quotation for Unit 1402 saves the record with official reference code.

---

### Phase 5: Escrow Accounts, MahaRERA Demands & Society Ledger
**Objective**: Live construction milestone billing and CHSL transit rent payments tracking.

- **Tasks**:
  1. Create Mongoose model: `models/DemandLedger.ts`.
  2. Create Server Actions in `app/actions/demand.ts`:
     - `getAllDemandsAction(projectId, status)`
     - `createDemandAction(data)`
     - `markDemandPaidAction(id, paymentDetails)`
     - `dispatchDemandNoticeAction(id)`
  3. Connect `app/dashboard/accounts/page.tsx`:
     - Live aggregation of Total Milestone Inflow, Pending Demands, and Society Redevelopment Outflow.
     - "Send Notice" updates dispatch timestamp in MongoDB.
     - "Trigger Demand / Rent Disbursal" creates live records.
  4. Test: Adding a society displacement hardship notice updates the outflow card instantly.

---

### Phase 6: Real-time WebSockets, Audit Logs & Performance Polish
**Objective**: Real-time push updates across browser sessions and enterprise security audits.

- **Tasks**:
  1. Global Search API (`/api/search?q=...`) to query Flats, Leads, and Projects in parallel.
  2. Server-Sent Events (SSE) or Pusher/WebSockets for live toast alerts when a new Meta/Google lead arrives.
  3. Full role permissions enforcement (Sales sees their assigned leads, Accounts sees treasury, Super Admin sees all).
  4. Automated daily database backup configuration.

---

## 5. Summary: Free Tools vs Paid Services Comparison

| Functionality | Paid Commercial Solution (Cost) | Our Built-In ERP Solution (Cost) | How We Do It For Free |
|---|---|---|---|
| **Meta Ads (FB/IG) Lead Sync** | Zapier / LeadsBridge (~₹3,000–₹6,000/mo) | **₹0 (100% Free)** | Direct Next.js Webhook (`/api/webhooks/meta`) connected to Meta Graph API |
| **Google Ads Form Sync** | Zapier Google Ads Integration (~₹3,000/mo) | **₹0 (100% Free)** | Native Google Ads Webhook delivery URL with secret verification token |
| **CRM Lead Tracking** | Privyr ($30/agent/mo = ~₹10,000/mo) | **₹0 (100% Free)** | Custom Frosted Glass CRM with 1-click WhatsApp & Calling dialer |
| **Document Generator** | PandaDoc / DocuSign (~₹2,500/mo) | **₹0 (100% Free)** | Built-in MahaRERA printable letterhead with auto-tax computation |
| **Total Monthly Savings** | **~₹18,500 to ₹25,000 / month** | **₹0.00** | Everything runs on your self-hosted Next.js & MongoDB instance! |

---

## 🚀 Execution Strategy

Jab aap bolo, hum **Phase 1 (Project Master & Database Foundation)** se shuru karenge:
1. `models/Project.ts` banayenge.
2. `seed-projects.ts` chala kar saare 10 projects MongoDB me daalenge.
3. Top Header aur Project Context ko database se link karenge.

Aap is roadmap ko check karo aur batao — **kya hum Phase 1 start karein?**


DATABASE_URL="mongodb+srv://websolutionsbdit_db_user:y5KogENrMzhbnQOt@cluster0.ijhvnry.mongodb.net/?appName=Cluster0"


# websolutionsbdit_db_user
# y5KogENrMzhbnQOt



Super Admin	admin@erp.com	admin123
Project Admin	admin_user@erp.com	admin123
Sales Executive	sales_user@erp.com	admin123
Accounts Desk	account_user@erp.com	admin123



