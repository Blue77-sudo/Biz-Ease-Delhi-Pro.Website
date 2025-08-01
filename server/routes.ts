import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBusinessProfileSchema, insertApplicationSchema, insertDocumentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get business profile
      const businessProfile = await storage.getBusinessProfile(user.id);

      res.json({ 
        user: { id: user.id, username: user.username, email: user.email },
        businessProfile 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.status(201).json({ 
        user: { id: user.id, username: user.username, email: user.email } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Business Profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getBusinessProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertBusinessProfileSchema.parse(req.body);
      const profile = await storage.createBusinessProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      const profile = await storage.updateBusinessProfile(userId, updates);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Applications
  app.get("/api/applications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const applications = await storage.getApplications(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const application = await storage.updateApplication(id, updates);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Compliance
  app.get("/api/compliance/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const items = await storage.getComplianceItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/compliance", async (req, res) => {
    try {
      const item = await storage.createComplianceItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Documents
  app.get("/api/documents/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const documents = await storage.getDocuments(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDocument(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Schemes
  app.get("/api/schemes", async (req, res) => {
    try {
      const { type } = req.query;
      
      let schemes;
      if (type && typeof type === 'string') {
        schemes = await storage.getSchemesByType(type);
      } else {
        schemes = await storage.getAllSchemes();
      }
      
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notifications
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markNotificationRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // AI responses based on common queries
      const responses = {
        "shop": "For Shop & Establishment License, you need: 1) Application form 2) Identity proof 3) Address proof 4) Business registration documents. The process typically takes 7-10 working days and costs ₹500-₹2,000 depending on business size.",
        "gst": "GST return filing deadlines: GSTR-3B is due by 20th of following month, GSTR-1 by 11th for monthly filers. Late filing attracts penalty of ₹200 per day. You can file through the GST portal or our integrated system.",
        "msme": "Delhi offers several MSME schemes: 1) MSME Credit Guarantee (collateral-free loans) 2) Technology Upgradation Fund 3) Export promotion schemes 4) Skill development programs. Based on your profile, you're eligible for multiple schemes.",
        "license": "Based on your business type and location, I recommend starting with Shop & Establishment License first, followed by GST registration if turnover exceeds ₹20 lakhs. Would you like me to guide you through the application process?",
        "compliance": "Your current compliance score is excellent at 92%. You have 2 upcoming deadlines: GST Return filing (5 days) and Shop & Establishment renewal (25 days). Would you like me to set reminders?",
        "default": "I'm here to help with all your business licensing and compliance needs. You can ask me about license applications, GST filing, MSME schemes, compliance deadlines, or any other business-related queries."
      };

      const lowerMessage = message.toLowerCase();
      let response = responses.default;

      for (const [key, value] of Object.entries(responses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
