import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessProfiles = pgTable("business_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  gstin: text("gstin"),
  udyamNumber: text("udyam_number"),
  businessAddress: text("business_address").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  applicationId: text("application_id").notNull().unique(),
  licenseType: text("license_type").notNull(),
  status: text("status").notNull().default("pending"),
  submittedDate: timestamp("submitted_date").defaultNow(),
  expectedCompletion: timestamp("expected_completion"),
  approvedDate: timestamp("approved_date"),
  validUntil: timestamp("valid_until"),
  formData: jsonb("form_data"),
  documents: jsonb("documents").default([]),
  queryRaised: text("query_raised"),
  notes: text("notes"),
});

export const complianceItems = pgTable("compliance_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemName: text("item_name").notNull(),
  itemType: text("item_type").notNull(),
  frequency: text("frequency").notNull(),
  lastFiled: timestamp("last_filed"),
  nextDue: timestamp("next_due").notNull(),
  status: text("status").notNull().default("upcoming"),
  reminderSent: boolean("reminder_sent").default(false),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  category: text("category"),
  isVerified: boolean("is_verified").default(false),
});

export const schemes = pgTable("schemes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schemeName: text("scheme_name").notNull(),
  schemeType: text("scheme_type").notNull(),
  description: text("description").notNull(),
  eligibilityCriteria: jsonb("eligibility_criteria"),
  fundingRange: text("funding_range"),
  applicationUrl: text("application_url"),
  isActive: boolean("is_active").default(true),
  governmentLevel: text("government_level").notNull(), // central, state, local
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // urgent, info, success, warning
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, submittedDate: true });
export const insertComplianceItemSchema = createInsertSchema(complianceItems).omit({ id: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadDate: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ComplianceItem = typeof complianceItems.$inferSelect;
export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Scheme = typeof schemes.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
