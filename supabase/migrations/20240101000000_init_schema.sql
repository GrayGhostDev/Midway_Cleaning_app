-- ============================================================
-- Midway Cleaning Platform — Complete Schema
-- Consolidated from all Prisma migrations
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'CLEANER', 'CLIENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ServiceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'CLIENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── User ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
    "id"          TEXT        NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "email"       TEXT        NOT NULL,
    "password"    TEXT,
    "name"        TEXT,
    "role"        "UserRole"  NOT NULL DEFAULT 'CLIENT',
    "isActive"    BOOLEAN     NOT NULL DEFAULT true,
    "phoneNumber" TEXT,
    "clerkId"     TEXT        NOT NULL DEFAULT '',
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"   ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkId_key" ON "User"("clerkId") WHERE "clerkId" <> '';
CREATE INDEX        IF NOT EXISTS "User_email_idx"   ON "User"("email");
CREATE INDEX        IF NOT EXISTS "User_role_idx"    ON "User"("role");

-- ── Address ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Address" (
    "id"        TEXT        NOT NULL,
    "street"    TEXT        NOT NULL,
    "city"      TEXT        NOT NULL,
    "state"     TEXT        NOT NULL,
    "zipCode"   TEXT        NOT NULL,
    "country"   TEXT        NOT NULL DEFAULT 'USA',
    "userId"    TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "Address_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Address_userId_key" ON "Address"("userId");
CREATE INDEX        IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");

-- ── Service ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Service" (
    "id"          TEXT           NOT NULL,
    "name"        TEXT           NOT NULL,
    "description" TEXT           NOT NULL,
    "price"       DECIMAL(10,2)  NOT NULL,
    "duration"    INTEGER        NOT NULL,
    "isActive"    BOOLEAN        NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Service_isActive_idx" ON "Service"("isActive");

-- ── Booking ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Booking" (
    "id"        TEXT            NOT NULL,
    "createdAt" TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    "date"      TIMESTAMPTZ     NOT NULL,
    "status"    "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "userId"    TEXT            NOT NULL,
    "serviceId" TEXT            NOT NULL,
    "notes"     TEXT,
    "cleanerId" TEXT,
    CONSTRAINT "Booking_pkey"      PRIMARY KEY ("id"),
    CONSTRAINT "Booking_userId_fkey"    FOREIGN KEY ("userId")    REFERENCES "User"("id")    ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "User"("id")    ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Booking_userId_idx"    ON "Booking"("userId");
CREATE INDEX IF NOT EXISTS "Booking_serviceId_idx" ON "Booking"("serviceId");
CREATE INDEX IF NOT EXISTS "Booking_status_idx"    ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "Booking_date_idx"      ON "Booking"("date");

-- ── Payment ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Payment" (
    "id"            TEXT           NOT NULL,
    "createdAt"     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "amount"        DECIMAL(10,2)  NOT NULL,
    "status"        "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "bookingId"     TEXT           NOT NULL,
    "transactionId" TEXT,
    "paymentMethod" TEXT,
    CONSTRAINT "Payment_pkey"          PRIMARY KEY ("id"),
    CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_bookingId_key" ON "Payment"("bookingId");
CREATE INDEX        IF NOT EXISTS "Payment_status_idx"    ON "Payment"("status");
CREATE INDEX        IF NOT EXISTS "Payment_bookingId_idx" ON "Payment"("bookingId");

-- ── Document ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Document" (
    "id"         TEXT        NOT NULL,
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name"       TEXT        NOT NULL,
    "url"        TEXT        NOT NULL,
    "type"       TEXT        NOT NULL,
    "size"       INTEGER     NOT NULL,
    "userId"     TEXT        NOT NULL,
    "isPublic"   BOOLEAN     NOT NULL DEFAULT false,
    "sharedWith" TEXT[]      NOT NULL DEFAULT '{}',
    CONSTRAINT "Document_pkey"         PRIMARY KEY ("id"),
    CONSTRAINT "Document_userId_fkey"  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Document_userId_idx" ON "Document"("userId");
CREATE INDEX IF NOT EXISTS "Document_type_idx"   ON "Document"("type");

-- ── Review ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Review" (
    "id"        TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "rating"    SMALLINT    NOT NULL,
    "comment"   TEXT,
    "userId"    TEXT        NOT NULL,
    "bookingId" TEXT        NOT NULL,
    CONSTRAINT "Review_pkey"           PRIMARY KEY ("id"),
    CONSTRAINT "Review_userId_fkey"    FOREIGN KEY ("userId")    REFERENCES "User"("id")    ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Review_bookingId_key" ON "Review"("bookingId");
CREATE INDEX        IF NOT EXISTS "Review_userId_idx"    ON "Review"("userId");
CREATE INDEX        IF NOT EXISTS "Review_rating_idx"    ON "Review"("rating");

-- ── Notification ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Notification" (
    "id"        TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "title"     TEXT        NOT NULL,
    "message"   TEXT        NOT NULL,
    "isRead"    BOOLEAN     NOT NULL DEFAULT false,
    "userId"    TEXT        NOT NULL,
    "bookingId" TEXT,
    CONSTRAINT "Notification_pkey"           PRIMARY KEY ("id"),
    CONSTRAINT "Notification_userId_fkey"    FOREIGN KEY ("userId")    REFERENCES "User"("id")    ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Notification_userId_idx"    ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_isRead_idx"    ON "Notification"("isRead");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");

-- ── Equipment ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Equipment" (
    "id"             TEXT        NOT NULL,
    "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name"           TEXT        NOT NULL,
    "description"    TEXT,
    "serialNumber"   TEXT,
    "purchaseDate"   TIMESTAMPTZ,
    "warrantyExpiry" TIMESTAMPTZ,
    "status"         TEXT        NOT NULL,
    "category"       TEXT        NOT NULL,
    "location"       TEXT,
    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Equipment_status_idx"   ON "Equipment"("status");
CREATE INDEX IF NOT EXISTS "Equipment_category_idx" ON "Equipment"("category");
CREATE INDEX IF NOT EXISTS "Equipment_location_idx" ON "Equipment"("location");

-- ── MaintenanceLog ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "MaintenanceLog" (
    "id"          TEXT           NOT NULL,
    "createdAt"   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "performedAt" TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "description" TEXT           NOT NULL,
    "cost"        DECIMAL(10,2)  NOT NULL,
    "type"        TEXT           NOT NULL,
    "status"      TEXT           NOT NULL,
    "equipmentId" TEXT           NOT NULL,
    CONSTRAINT "MaintenanceLog_pkey"            PRIMARY KEY ("id"),
    CONSTRAINT "MaintenanceLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "MaintenanceLog_performedAt_idx" ON "MaintenanceLog"("performedAt");
CREATE INDEX IF NOT EXISTS "MaintenanceLog_equipmentId_idx" ON "MaintenanceLog"("equipmentId");
CREATE INDEX IF NOT EXISTS "MaintenanceLog_type_idx"        ON "MaintenanceLog"("type");
CREATE INDEX IF NOT EXISTS "MaintenanceLog_status_idx"      ON "MaintenanceLog"("status");

-- ── Location ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Location" (
    "id"        TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name"      TEXT        NOT NULL,
    "address"   TEXT,
    "type"      TEXT        NOT NULL,
    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Location_name_idx" ON "Location"("name");
CREATE INDEX IF NOT EXISTS "Location_type_idx" ON "Location"("type");

-- ── InventoryItem ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "InventoryItem" (
    "id"              TEXT        NOT NULL,
    "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name"            TEXT        NOT NULL,
    "description"     TEXT,
    "category"        TEXT        NOT NULL,
    "unit"            TEXT        NOT NULL,
    "minQuantity"     INTEGER     NOT NULL DEFAULT 0,
    "currentQuantity" INTEGER     NOT NULL DEFAULT 0,
    "locationId"      TEXT,
    CONSTRAINT "InventoryItem_pkey"         PRIMARY KEY ("id"),
    CONSTRAINT "InventoryItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "InventoryItem_name_idx"       ON "InventoryItem"("name");
CREATE INDEX IF NOT EXISTS "InventoryItem_category_idx"   ON "InventoryItem"("category");
CREATE INDEX IF NOT EXISTS "InventoryItem_locationId_idx" ON "InventoryItem"("locationId");

-- ── InventoryTransaction ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS "InventoryTransaction" (
    "id"        TEXT           NOT NULL,
    "createdAt" TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "date"      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "type"      TEXT           NOT NULL,
    "quantity"  INTEGER        NOT NULL,
    "cost"      DECIMAL(10,2)  NOT NULL,
    "itemId"    TEXT           NOT NULL,
    CONSTRAINT "InventoryTransaction_pkey"        PRIMARY KEY ("id"),
    CONSTRAINT "InventoryTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "InventoryTransaction_date_idx"   ON "InventoryTransaction"("date");
CREATE INDEX IF NOT EXISTS "InventoryTransaction_type_idx"   ON "InventoryTransaction"("type");
CREATE INDEX IF NOT EXISTS "InventoryTransaction_itemId_idx" ON "InventoryTransaction"("itemId");

-- ── Shift ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Shift" (
    "id"         TEXT           NOT NULL,
    "createdAt"  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "startTime"  TIMESTAMPTZ    NOT NULL,
    "endTime"    TIMESTAMPTZ    NOT NULL,
    "duration"   INTEGER        NOT NULL,
    "status"     TEXT           NOT NULL,
    "userId"     TEXT           NOT NULL,
    "notes"      TEXT,
    "hourlyRate" DECIMAL(10,2)  NOT NULL,
    CONSTRAINT "Shift_pkey"         PRIMARY KEY ("id"),
    CONSTRAINT "Shift_userId_fkey"  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Shift_startTime_idx" ON "Shift"("startTime");
CREATE INDEX IF NOT EXISTS "Shift_endTime_idx"   ON "Shift"("endTime");
CREATE INDEX IF NOT EXISTS "Shift_userId_idx"    ON "Shift"("userId");
CREATE INDEX IF NOT EXISTS "Shift_status_idx"    ON "Shift"("status");

-- ── Task ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Task" (
    "id"          TEXT        NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "title"       TEXT        NOT NULL,
    "description" TEXT,
    "status"      TEXT        NOT NULL,
    "priority"    TEXT        NOT NULL,
    "dueDate"     TIMESTAMPTZ,
    "cleanerId"   TEXT,
    "bookingId"   TEXT,
    CONSTRAINT "Task_pkey"           PRIMARY KEY ("id"),
    CONSTRAINT "Task_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "User"("id")    ON DELETE SET NULL  ON UPDATE CASCADE,
    CONSTRAINT "Task_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL  ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Task_status_idx"    ON "Task"("status");
CREATE INDEX IF NOT EXISTS "Task_priority_idx"  ON "Task"("priority");
CREATE INDEX IF NOT EXISTS "Task_dueDate_idx"   ON "Task"("dueDate");
CREATE INDEX IF NOT EXISTS "Task_cleanerId_idx" ON "Task"("cleanerId");
CREATE INDEX IF NOT EXISTS "Task_bookingId_idx" ON "Task"("bookingId");

-- ── Feedback ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Feedback" (
    "id"        TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "rating"    INTEGER     NOT NULL DEFAULT 0,
    "comment"   TEXT,
    "userId"    TEXT,
    "bookingId" TEXT,
    CONSTRAINT "Feedback_pkey"           PRIMARY KEY ("id"),
    CONSTRAINT "Feedback_userId_fkey"    FOREIGN KEY ("userId")    REFERENCES "User"("id")    ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Feedback_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Feedback_bookingId_key" ON "Feedback"("bookingId");
CREATE INDEX        IF NOT EXISTS "Feedback_rating_idx"    ON "Feedback"("rating");
CREATE INDEX        IF NOT EXISTS "Feedback_userId_idx"    ON "Feedback"("userId");

-- ── Report ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Report" (
    "id"          TEXT        NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "title"       TEXT        NOT NULL,
    "type"        TEXT        NOT NULL,
    "status"      TEXT        NOT NULL,
    "data"        JSONB,
    "startDate"   TIMESTAMPTZ NOT NULL,
    "endDate"     TIMESTAMPTZ NOT NULL,
    "generatedBy" TEXT,
    "format"      TEXT        NOT NULL,
    "url"         TEXT,
    "error"       TEXT,
    CONSTRAINT "Report_pkey"              PRIMARY KEY ("id"),
    CONSTRAINT "Report_generatedBy_fkey"  FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Report_type_idx"        ON "Report"("type");
CREATE INDEX IF NOT EXISTS "Report_status_idx"      ON "Report"("status");
CREATE INDEX IF NOT EXISTS "Report_generatedBy_idx" ON "Report"("generatedBy");
CREATE INDEX IF NOT EXISTS "Report_startDate_idx"   ON "Report"("startDate");
CREATE INDEX IF NOT EXISTS "Report_endDate_idx"     ON "Report"("endDate");

-- ── Profile ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Profile" (
    "id"        TEXT  NOT NULL,
    "userId"    TEXT  NOT NULL,
    "firstName" TEXT,
    "lastName"  TEXT,
    "phone"     TEXT,
    "address"   TEXT,
    "company"   TEXT,
    CONSTRAINT "Profile_pkey"        PRIMARY KEY ("id"),
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userId_key" ON "Profile"("userId");
