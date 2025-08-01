import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  BusinessProfile,
  InsertBusinessProfile,
  Application,
  InsertApplication,
  ComplianceItem,
  InsertComplianceItem,
  Document,
  InsertDocument,
  Scheme,
  Notification,
  InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Business Profiles
  getBusinessProfile(userId: string): Promise<BusinessProfile | undefined>;
  createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile>;
  updateBusinessProfile(userId: string, profile: Partial<InsertBusinessProfile>): Promise<BusinessProfile | undefined>;
  
  // Applications
  getApplications(userId: string): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined>;
  
  // Compliance
  getComplianceItems(userId: string): Promise<ComplianceItem[]>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;
  updateComplianceItem(id: string, updates: Partial<ComplianceItem>): Promise<ComplianceItem | undefined>;
  
  // Documents
  getDocuments(userId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<boolean>;
  
  // Schemes
  getAllSchemes(): Promise<Scheme[]>;
  getSchemesByType(type: string): Promise<Scheme[]>;
  
  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private businessProfiles: Map<string, BusinessProfile> = new Map();
  private applications: Map<string, Application> = new Map();
  private complianceItems: Map<string, ComplianceItem> = new Map();
  private documents: Map<string, Document> = new Map();
  private schemes: Map<string, Scheme> = new Map();
  private notifications: Map<string, Notification> = new Map();

  constructor() {
    this.initializeSchemes();
  }

  private initializeSchemes() {
    const sampleSchemes: Scheme[] = [
      {
        id: randomUUID(),
        schemeName: "MSME Credit Guarantee Scheme",
        schemeType: "financial",
        description: "Collateral-free loans up to ₹2 crores for manufacturing units",
        eligibilityCriteria: { businessType: ["manufacturing", "service"], maxTurnover: "20000000" },
        fundingRange: "₹10 lakhs - ₹2 crores",
        applicationUrl: "https://www.cgtmse.in/",
        isActive: true,
        governmentLevel: "central"
      },
      {
        id: randomUUID(),
        schemeName: "Delhi Startup Policy",
        schemeType: "startup",
        description: "Seed funding, incubation support, and tax benefits for startups",
        eligibilityCriteria: { businessAge: "< 5 years", businessType: ["it", "service"] },
        fundingRange: "Up to ₹20 lakhs",
        applicationUrl: "https://dipp.gov.in/",
        isActive: true,
        governmentLevel: "state"
      },
      {
        id: randomUUID(),
        schemeName: "Delhi Industrial Policy 2020",
        schemeType: "industrial",
        description: "Land subsidies, power incentives, and R&D support",
        eligibilityCriteria: { businessType: ["manufacturing"], location: "Delhi" },
        fundingRange: "₹1 crore - ₹10 crores",
        applicationUrl: "https://delhi.gov.in/",
        isActive: true,
        governmentLevel: "state"
      },
      {
        id: randomUUID(),
        schemeName: "PM Employment Generation Programme",
        schemeType: "employment",
        description: "Financial assistance to generate employment opportunities",
        eligibilityCriteria: { businessType: ["manufacturing", "service", "retail"] },
        fundingRange: "₹10 lakhs - ₹25 lakhs",
        applicationUrl: "https://www.kviconline.gov.in/",
        isActive: true,
        governmentLevel: "central"
      },
      {
        id: randomUUID(),
        schemeName: "Export Promotion Scheme",
        schemeType: "export",
        description: "Financial assistance for market development and export infrastructure",
        eligibilityCriteria: { hasExports: true },
        fundingRange: "₹5 lakhs - ₹50 lakhs",
        applicationUrl: "https://dgft.gov.in/",
        isActive: true,
        governmentLevel: "central"
      }
    ];

    sampleSchemes.forEach(scheme => {
      this.schemes.set(scheme.id, scheme);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Business Profiles
  async getBusinessProfile(userId: string): Promise<BusinessProfile | undefined> {
    return Array.from(this.businessProfiles.values()).find(profile => profile.userId === userId);
  }

  async createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile> {
    const id = randomUUID();
    const businessProfile: BusinessProfile = {
      id,
      userId: profile.userId,
      businessName: profile.businessName,
      businessType: profile.businessType,
      businessAddress: profile.businessAddress,
      contactEmail: profile.contactEmail,
      contactPhone: profile.contactPhone,
      gstin: profile.gstin || null,
      udyamNumber: profile.udyamNumber || null,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.businessProfiles.set(id, businessProfile);
    return businessProfile;
  }

  async updateBusinessProfile(userId: string, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile | undefined> {
    const existing = await this.getBusinessProfile(userId);
    if (!existing) return undefined;

    const updated: BusinessProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.businessProfiles.set(existing.id, updated);
    return updated;
  }

  // Applications
  async getApplications(userId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.userId === userId);
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const applicationId = `BIZDEL${String(this.applications.size + 1).padStart(3, '0')}`;
    
    const newApplication: Application = {
      id,
      userId: application.userId,
      applicationId,
      licenseType: application.licenseType,
      status: application.status || "pending",
      submittedDate: new Date(),
      expectedCompletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      approvedDate: null,
      validUntil: null,
      queryRaised: null,
      notes: null,
      formData: application.formData,
      documents: application.documents
    };
    
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined> {
    const existing = this.applications.get(id);
    if (!existing) return undefined;

    const updated: Application = { ...existing, ...updates };
    this.applications.set(id, updated);
    return updated;
  }

  // Compliance
  async getComplianceItems(userId: string): Promise<ComplianceItem[]> {
    return Array.from(this.complianceItems.values()).filter(item => item.userId === userId);
  }

  async createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem> {
    const id = randomUUID();
    const complianceItem: ComplianceItem = { 
      id,
      userId: item.userId,
      itemName: item.itemName,
      itemType: item.itemType,
      frequency: item.frequency,
      nextDue: item.nextDue,
      status: item.status || "pending",
      lastFiled: item.lastFiled || null,
      reminderSent: item.reminderSent || null
    };
    this.complianceItems.set(id, complianceItem);
    return complianceItem;
  }

  async updateComplianceItem(id: string, updates: Partial<ComplianceItem>): Promise<ComplianceItem | undefined> {
    const existing = this.complianceItems.get(id);
    if (!existing) return undefined;

    const updated: ComplianceItem = { ...existing, ...updates };
    this.complianceItems.set(id, updated);
    return updated;
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const newDocument: Document = {
      id,
      userId: document.userId,
      fileName: document.fileName,
      fileType: document.fileType,
      fileSize: document.fileSize,
      category: document.category || null,
      uploadDate: new Date(),
      isVerified: false
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Schemes
  async getAllSchemes(): Promise<Scheme[]> {
    return Array.from(this.schemes.values()).filter(scheme => scheme.isActive);
  }

  async getSchemesByType(type: string): Promise<Scheme[]> {
    return Array.from(this.schemes.values()).filter(scheme => 
      scheme.isActive && scheme.schemeType === type
    );
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const newNotification: Notification = {
      ...notification,
      id,
      isRead: false,
      createdAt: new Date()
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
}

export const storage = new MemStorage();
