# BACKEND ARCHITECTURE & DATABASE DESIGN SPECIFICATION

## A. System Architecture

**Recommended Stack:**
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **ORM:** Prisma
- **Database:** PostgreSQL

**Architectural Considerations:**
- **Node.js + Express:** A robust, standard, and highly scalable setup that is ecosystem-compatible with the React frontend.
- **Prisma + PostgreSQL:** Real estate and billing requirements demand a strictly relational architecture with ACID properties. Prisma's type-safety prevents accidental relations bugs and maps naturally into Express controllers. 
- **Monetary Strategy:** PostgreSQL DECIMAL(10,2) must be used for all currency (e.g. BDT/Taka). Do NOT use FLOAT in JavaScript or the DB to prevent precision drift.
- **Date/Time Strategy:** Store all dates as TIMESTAMPTZ (UTC) in PostgreSQL. Format to local time (Dhaka/Asia) only immediately before sending to the client, or let the frontend format UTC directly.

## B. Entity List
1. User (Roles: Owner, Tenant, Admin)
2. Property
3. Unit
4. Lease (Maps Tenant to Unit over time)
5. Notice
6. Bill
7. BillItem
8. Payment
9. UtilityReading
10. ParkingSlot
11. MaintenanceRequest
12. Conversation
13. Message
14. Expense
15. SupportTicket
16. SystemSetting

## C. Detailed Database Schema

### 1. User
- id (UUID, PK)
- 
ame (VARCHAR, Required)
- email (VARCHAR, Required, Unique)
- password_hash (VARCHAR, Required)
- ole (RoleEnum: OWNER, TENANT, ADMIN) - Required
- phone (VARCHAR, Nullable)
- status (UserStatusEnum: ACTIVE, PENDING, SUSPENDED)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### 2. Property
- id (UUID, PK)
- owner_id (UUID, FK -> User) - Required
- 
ame (VARCHAR, Required)
- ddress (TEXT, Required)
- year_built (INT, Nullable)
- property_type (VARCHAR, Required)
- status (StringEnum: ACTIVE, INACTIVE) - Required

### 3. Unit (Flat)
- id (UUID, PK)
- property_id (UUID, FK -> Property) - Required
- unit_number (VARCHAR, Required)
- loor_number (VARCHAR, Required)
- edrooms (INT, Nullable)
- athrooms (INT, Nullable)
- rea_sqft (INT, Nullable)
- status (UnitStatusEnum: OCCUPIED, VACANT, MAINTENANCE) - Required
- ase_rent (DECIMAL, Required)

### 4. Lease (Tenant occupancy over time)
- id (UUID, PK)
- unit_id (UUID, FK -> Unit) - Required
- 	enant_id (UUID, FK -> User) - Required
- start_date (DATE, Required)
- end_date (DATE, Nullable)
- greed_rent (DECIMAL, Required)
- status (LeaseStatusEnum: ACTIVE, TERMINATED, PENDING) - Required

### 5. ParkingSlot
- id (UUID, PK)
- property_id (UUID, FK -> Property) - Required
- slot_label (VARCHAR, Required)
- current_lease_id (UUID, FK -> Lease, Nullable)
- ehicle_info (VARCHAR, Nullable)

### 6. Bill
*Note: A bill represents the aggregate invoice for a specific month. It DOES NOT store a hardcoded itemized array; it aggregates items.*
- id (UUID, PK)
- lease_id (UUID, FK -> Lease) - Required
- illing_month (VARCHAR 'YYYY-MM', Required)
- due_date (DATE, Required)
- 	otal_amount (DECIMAL, Required) - System derived from SUM(BillItems)
- status (BillStatusEnum: PENDING, PAID, OVERDUE) - Required
- published_at (TIMESTAMPTZ, Nullable)

### 7. BillItem
*Note: This fulfills the requirement of line-item billing (Rent, Gas, etc).*
- id (UUID, PK)
- ill_id (UUID, FK -> Bill) - Required
- item_type (BillItemEnum: RENT, ELECTRICITY, WATER, GAS, SERVICE_CHARGE, PARKING, OTHER)
- description (VARCHAR, Nullable)
- mount (DECIMAL, Required)

### 8. Payment
- id (UUID, PK)
- ill_id (UUID, FK -> Bill) - Required
- 	enant_id (UUID, FK -> User) - Required
- mount (DECIMAL, Required)
- method (PaymentMethodEnum: BKASH, NAGAD, CASH, BANK_TRANSFER) - Required
- 	ransaction_id (VARCHAR, Unique, Nullable)
- eceipt_number (VARCHAR, Unique, Nullable)
- status (PaymentStatusEnum: PENDING, VERIFIED, FAILED) - Required
- payment_date (TIMESTAMPTZ)

### 9. UtilityReading
- id (UUID, PK)
- unit_id (UUID, FK -> Unit) - Required
- utility_type (UtilityEnum: ELECTRICITY, WATER, GAS)
- eading_date (DATE, Required)
- previous_reading (DECIMAL)
- current_reading (DECIMAL)
- cost_per_unit (DECIMAL)
- 	otal_cost (DECIMAL) -> Should map to a BillItem.

### 10. MaintenanceRequest
- id (UUID, PK)
- 	enant_id (UUID, FK -> User) - Required
- unit_id (UUID, FK -> Unit) - Required
- issue_title (VARCHAR, Required)
- description (TEXT, Required)
- priority (PriorityEnum: LOW, MEDIUM, HIGH)
- status (MaintenanceStatus: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED)
- epair_cost (DECIMAL, Nullable)
- ssigned_to (VARCHAR, Nullable)
- created_at (TIMESTAMPTZ)

### 11. Notice
- id (UUID, PK)
- uthor_id (UUID, FK -> User) - Required
- property_id (UUID, FK -> Property) - Nullable (Null = Platform-wide)
- 	itle (VARCHAR, Required)
- category (NoticeCategory: MAINTENANCE, GENERAL, POLICY, BILLING)
- udience (NoticeAudienceEnum: ALL_TENANTS, PROPERTY_SPECIFIC)
- details (TEXT, Required)
- status (StringEnum: DRAFT, PUBLISHED)
- publish_date (TIMESTAMPTZ)

### 12. Expense
- id (UUID, PK)
- property_id (UUID, FK -> Property)
- category (VARCHAR)
- mount (DECIMAL)
- expense_date (DATE)
- description (TEXT)

### 13 & 14. Conversation and Message
- **Conversation:** id, unit_id (Context scope), created_at
- **ConversationParticipant:** conversation_id, user_id
- **Message:** id, conversation_id, sender_id, content, ead_by, created_at

### 15. SupportTicket
- id (UUID, PK), user_id (FK), subject, description, priority, status, created_at

### 16. SystemSettings
- key (VARCHAR, PK), alue (JSONB)

## D. Entity Relationship Diagram in Mermaid

\\\mermaid
erDiagram
    USER ||--o{ PROPERTY : owns
    USER ||--o{ LEASE : is_tenant
    PROPERTY ||--|{ UNIT : contains
    PROPERTY ||--o{ PARKING_SLOT : has_slots
    UNIT ||--o{ LEASE : is_leased_by
    UNIT ||--o{ UTILITY_READING : records
    LEASE ||--o{ PARKING_SLOT : occupies
    LEASE ||--o{ BILL : generates
    BILL ||--|{ BILL_ITEM : contains
    BILL ||--o{ PAYMENT : paid_via
    UNIT ||--o{ MAINTENANCE_REQUEST : causes
    USER ||--o{ MAINTENANCE_REQUEST : raises
\\\

## E. Enums
- **UserRoles:** OWNER, TENANT, ADMIN
- **UnitStatus:** OCCUPIED, VACANT, MAINTENANCE
- **BillStatus:** PENDING, PAID, OVERDUE
- **BillItemTypes:** RENT, ELECTRICITY, WATER, GAS, SERVICE_CHARGE, PARKING, OTHER
- **PaymentMethod:** BKASH, NAGAD, CASH, BANK_TRANSFER
- **RequestStatus:** OPEN, ASSIGNED, IN_PROGRESS, RESOLVED
- **PaymentStatus:** PENDING, VERIFIED, FAILED

## F. Constraints & Indexes
- **Constraints:**
  - Bill.total_amount MUST equal SUM(BillItem.amount). Validation triggers on DB or Prisma middleware layer.
  - Payment.amount MUST NOT exceed Bill.total_amount without specific overpayment accounting.
- **Indexes:**
  - idx_lease_tenant_id_active on Lease (tenant_id) where status = ACTIVE
  - idx_bill_lease_month on Bill (lease_id, billing_month)
  - idx_payment_trx on Payment (transaction_id) -> high velocity lookups for Webhooks.

## G. Authentication & Authorization
**Current Mock Flow:**
Stores raw unencrypted JavaScript objects in window.localStorage (uildsync_auth_user).

**Target Transition Flow:**
1. **Login (POST /api/auth/login):** Match email/password, verify bcrypt hash.
2. **Token generation:** Generate a secure JWT containing id and ole. 
3. **Storage:** Set the JWT in an **HTTP-Only, Secure cookie** to prevent XSS. 
4. **Validation (Middleware):** Every protected API route runs equireAuth.
5. **Authorization (Middleware):**
   - **Owner:** equireRole('OWNER'). Can only read/write Bills, Properties, Units where Property.owner_id === req.user.id.
   - **Tenant:** equireRole('TENANT'). Can only read Bills and post Maintenance requests linked to their active Lease.tenant_id.
   - **Admin:** equireRole('ADMIN'). Can view and override across the platform.

## H. & I. Frontend-to-API Mapping

**1. OWNER PAGES:**
- **Dashboard:** 
  - Uses: Summary metrics, recent payments.
  - Future API: GET /api/owner/dashboard/summary, GET /api/owner/dashboard/activity
- **My Properties / Property Details:**
  - Uses: propertiesList, units
  - Future API: GET /api/properties, GET /api/properties/:id/units (CREATE, UPDATE, DELETE allowed for owner via POST/PUT).
- **Tenants:**
  - Uses: 	enantsList 
  - Future API: GET /api/leases?owner=true
- **Billing & Payments:**
  - Uses: Owner-view bills.
  - Future API: GET /api/bills?property_id=X (CREATE POST /api/bills, accepts nested items array to generate Bill + BillItems).
- **Maintenance, Notices, Reports etc:** 
  - Map to standard REST endpoints scoped to properties owned by eq.user.id.

**2. TENANT PAGES:**
- **Dashboard / My Flat:**
  - Uses: Unit detail, active lease info.
  - Future API: GET /api/leases/me (joins Unit and Property data).
- **My Bills & Payments:**
  - Uses: 	enantBills, 	enantPayments
  - Future API: GET /api/bills/me (pulls all Bills + nested BillItems. 	otal_amount aggregated backend-side).
- **Maintenance:**
  - Uses: 	enantMaintenance
  - Future API: GET /api/maintenance/me, POST /api/maintenance.
- **Notices:**
  - Uses: 	enantNotices
  - Future API: GET /api/notices?property_id=MY_PROPERTY

**3. ADMIN PAGES:**
- **Dashboard, Users, Properties, Support Tickets:**
  - Full CRUD REST architecture (GET /api/admin/users, PATCH /api/admin/properties/:id/status, etc). 

## J. Dashboard Aggregations
- **Owner Dashboard Revenue:** SQL: SELECT SUM(total_amount) FROM bills b JOIN leases l ON b.lease_id = l.id JOIN units u ON l.unit_id = u.id JOIN properties p ON u.property_id = p.id WHERE p.owner_id = ? AND b.status = 'PAID'
- **Occupancy Rate:** Calculated server-side 	otal_occupied / total_units to prevent unneeded data transfer to Client. 

## K. Payment Integration Points (bKash/Nagad)
> *Note: External payments are NOT implemented locally.*
1. **Start:** Tenant clicks "Pay" -> UI requests POST /api/payments/bkash/create passing Bill_ID.
2. **Provider Transit:** Backend connects to bKash API, returns a payment URL. Tenant navigates to bKash.
3. **Webhook Callback:** bKash fires a webhook to POST /api/webhooks/bkash.
4. **Verification:** Backend verifies the signature/token.
5. **Update State:** Backend creates the Payment record locally (status: VERIFIED), and updates Bill status to PAID. (The system MUST store the Provider's 	ransaction_id locally).
6. **Receipt:** Backend generates a Receipt string to be queried by the Frontend.

## L. Seed Data Requirements
Seed script (prisma/seed.js) must generate:
- Users: 1 Admin, 2 Owners, 5 Tenants
- Real Estate: 3 Properties with 10 Units each (assigned to Owners).
- Operations: Active leases linking Tenants to Units. Historical Bills (6 months) with exact granular BillItems (Rent, Water, Gas), and their verified Payments to populate charts.

## M. Security Considerations
- Validate the sum of BillItems mathematically matches the Bill.total_amount before finalizing.
- Block Tenant A from fetching GET /api/bills/:id if the bill's lease_id does not match Tenant A's active lease.
- Rate-limit all auth and webhook callback routes.

## N. Implementation Order
1. Setup Prisma Schema & DB migrations.
2. Build JWT Authentication framework & Role Guard middlewares.
3. Scaffold Core Relational Endpoints (Properties, Units, Leases).
4. Build Billing Engine (Nested Writes for Bill + BillItems).
5. Build Webhook Listener foundations for bKash.
6. Connect Frontend via Axios (replacing window.localStorage and mock __data.js imports).

## O. Open Questions / Decisions Requiring Confirmation
- **Late Fees:** Do late fees apply automatically on due_date + 1 via a cron job, dynamically inserting a new BillItem? 
- **Partial Payments:** Will the platform accept partial clearing of a single Bill?
- **Conversation Polling:** Should chat utilize WebSockets / Socket.io, or standard long-polling standard REST?

---

**BACKEND IMPLEMENTATION: NOT STARTED**
**DATABASE IMPLEMENTATION: NOT STARTED**
**API IMPLEMENTATION: NOT STARTED**
