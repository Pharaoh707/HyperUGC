import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[Warning] GEMINI_API_KEY environment variable is not set. Chatbot will run in offline mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON request bodies up to 10MB
  app.use(express.json({ limit: "10mb" }));

  // API Route: Submit Brief
  app.post("/api/submit-brief", async (req, res) => {
    try {
      const briefData = req.body;
      
      console.log("[Server] Received brief:", briefData.brandName);

      // 1. Ensure a directory for saving local copies of briefs exists
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      const filePath = path.join(dataDir, "submitted_briefs.json");
      let allBriefs = [];
      if (fs.existsSync(filePath)) {
        try {
          allBriefs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (e) {
          allBriefs = [];
        }
      }
      
      const newRecord = {
        id: `brief_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        ...briefData,
      };
      allBriefs.push(newRecord);
      fs.writeFileSync(filePath, JSON.stringify(allBriefs, null, 2), "utf-8");
      console.log("[Server] Brief saved to local file system:", filePath);

      // 2. Extract SMTP details from env variables
      const smtpHost = process.env.SMTP_HOST || "";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER || "";
      const smtpPass = process.env.SMTP_PASS || "";
      const smtpFrom = process.env.SMTP_FROM || smtpUser || "hello@mandjack.digital";

      let emailSent = false;
      let emailError = "";

      if (smtpHost && smtpUser && smtpPass) {
        console.log("[Server] Initiating SMTP email dispatch to hello@mandjack.digital via:", smtpHost);
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // True for 465, false for 587/other
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              // Do not fail on invalid certs / self-signed certs
              rejectUnauthorized: false,
            },
          });

          const mailBody = `
Hello Mandjack Digital Team,

You have received a new premium client brief from your Intake Portal!

--- CLIENT INFRASTRUCTURE ---
Brand Name: ${briefData.brandName || "N/A"}
Website URL: ${briefData.websiteUrl || "N/A"}
Contact Email Address: ${briefData.email || "N/A"}
Social Handles: ${briefData.socials || "N/A"}

--- CONCEPT CREATIVE BRIEF ---
Product being advertised: 
${briefData.productOffer || "N/A"}

Target audience: 
${briefData.targetAudience || "N/A"}

Tone & Feel: 
${briefData.toneFeel || "N/A"}

3 Reference Ads / Competitors admired: 
${briefData.references || "N/A"}

--- ASSETS & ADDITIONAL NOTES ---
Drive/Dropbox Assets Link: ${briefData.assetsLink || "None provided"}
Uploaded File attachment reference: ${briefData.uploadedFile || "None"}
Additional Notes or Preferences: 
${briefData.extraNotes || "None"}

--- SYSTEM DETAILS ---
Timestamp (UTC): ${newRecord.submittedAt}
ID: ${newRecord.id}

Sent with priority from the Mandjack Digital Intake Portal.
`;

          const attachments = [];
          if (briefData.fileData && briefData.uploadedFile) {
            const matches = briefData.fileData.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const contentType = matches[1];
              const base64Data = matches[2];
              attachments.push({
                filename: briefData.uploadedFile,
                content: Buffer.from(base64Data, "base64"),
                contentType: contentType
              });
              console.log("[Server] Decoded base64 file attachment:", briefData.uploadedFile);
            } else {
              attachments.push({
                filename: briefData.uploadedFile,
                path: briefData.fileData
              });
              console.log("[Server] Attached file as Data URI pathfallback:", briefData.uploadedFile);
            }
          }

          await transporter.sendMail({
            from: `"${briefData.brandName} Intake" <${smtpFrom}>`,
            to: "hello@mandjack.digital",
            replyTo: briefData.email,
            subject: `Mandjack Digital Brief: ${briefData.brandName}`,
            text: mailBody,
            attachments: attachments
          });

          console.log("[Server] Email successfully delivered to hello@mandjack.digital!");
          emailSent = true;
        } catch (err: any) {
          console.error("[Server Error] Failed sending via SMTP:", err.message);
          emailError = err.message;
        }
      } else {
        console.log("[Server Warning] Mail dispatch deferred - SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured in environment variables to deliver emails. The brief was successfully saved locally on the container disk.");
      }

      res.json({
        success: true,
        savedLocally: true,
        emailSent,
        emailError: emailError || null,
        message: "Brief stored and logged successfully.",
      });

    } catch (apiErr: any) {
      console.error("[API Error] Failed processing intake:", apiErr);
      res.status(500).json({
        success: false,
        error: apiErr.message || "Internal Server Error",
      });
    }
  });

  // API Route: Conversion Chatbot using Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array format." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          text: "Thanks for visiting Mandjack.Digital! I am currently running in offline display mode. If you have any questions or want to secure our special $300 deposit promotion, click \"CLAIM YOUR SPOT\" at the bottom, or type your name and email so our team can get in touch with you shortly!",
          offline: true,
        });
      }

      // Convert format to standard Google GenAI message role types
      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content || "" }],
      }));

      const systemInstruction = `You are a Conversion-Optimized AI Brand Assistant for Mandjack.Digital.

Your primary objective is to answer visitor questions clearly, concisely, and gracefully while optimizing for conversion without being overly aggressive or pushy. Guide users toward:
1. Clicking 'CLAIM YOUR SPOT' / filling out the Briefing Intake form.
2. Booking the special $300 launch deposit promo (50% off standard pricing: $1,200 standard is reduced to $600 total, with $300 deposit today to lock it in and the balance paid on delivery).

CORE MANDJACK.DIGITAL FACTS:
- Services: Fully-produced, high-converting organic UGC video creatives for DTC brands, SaaS, and Personal Brands.
- Special Offer: $300 deposit to lock in 5 video deliverables ($600 total instead of $1,200). Zero risk.
- Turnaround time: Delivered clean in exactly 3 days (72 hours).
- High visual quality: Studio lighting, focus texture closeups, and clean professional audio with lapel mics.
- Visual styles: Authentic shopper style, organic speaking script pacing, scroll-stopping hook variants included.
- Design: Delivered pre-cropped and centered for both 1:1 and 9:16 (perfect for TikTok, Reels, and Shorts).
- Usage: Revisions fully included, perpetual global usage rights, no hidden actor residuals.

ESCALATION TRIGGER:
If the user asks an out-of-scope question, requests custom services we do not provide (like complex CGI), asks for complex manual quotes, or explicitly wants to contact or work with a human representative:
1. Reassure them warmly and explain that we handle custom specs via direct human review.
2. Prompt them to leave their contact details (Name, Email, Website, and Question) so that our elite human representatives can attend to their query shortly. Explain that they can type them here or interact with the handy form right in their chat thread!
3. Keep the tone hospitable and focused on absolute convenience and client success.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "I'd love to help you scale your UGC creatives. If you have any custom requests, feel free to share, or click Claim Your Spot to lock in our current promo!";
      return res.json({ text });
    } catch (err: any) {
      console.error("[Chat API Error]:", err);
      return res.status(500).json({ error: err.message || "An error occurred during chat processing." });
    }
  });

  // API Route: Submit Handover/Contact Request
  app.post("/api/chat/submit-support", async (req, res) => {
    try {
      const { name, email, website, question } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email is required." });
      }

      console.log("[Server] Support chat contact card received from:", email);

      // Save to local json persistence
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }

      const filePath = path.join(dataDir, "support_tickets.json");
      let allTickets = [];
      if (fs.existsSync(filePath)) {
        try {
          allTickets = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (e) {
          allTickets = [];
        }
      }

      const newRecord = {
        id: `ticket_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        name: name || "Anonymous Visitor",
        email,
        website: website || "N/A",
        question: question || "N/A",
      };
      allTickets.push(newRecord);
      fs.writeFileSync(filePath, JSON.stringify(allTickets, null, 2), "utf-8");

      // Attempt to fire email dispatch
      const smtpHost = process.env.SMTP_HOST || "";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER || "";
      const smtpPass = process.env.SMTP_PASS || "";
      const smtpFrom = process.env.SMTP_FROM || smtpUser || "hello@mandjack.digital";

      let emailSent = false;
      let emailError = "";

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          await transporter.sendMail({
            from: `"${newRecord.name} (Support Chat)" <${smtpFrom}>`,
            to: "hello@mandjack.digital",
            replyTo: email,
            subject: `Chat Query Escalation: ${newRecord.name}`,
            text: `
Hello Mandjack Digital Team,

A visitor has submitted their contact details in the Conversion Support Chat for direct human review.

--- VISITOR DETAILS ---
Name: ${newRecord.name}
Email: ${newRecord.email}
Website: ${newRecord.website}

--- MESSAGE OR QUERY ---
${newRecord.question}

--- AUDIT DETAILS ---
Submitted At: ${newRecord.submittedAt}
Ticket ID: ${newRecord.id}

Please contact the prospect as soon as possible to answer their custom inquiry.
`,
          });
          emailSent = true;
          console.log("[Server] Escaled chat query safely emailed to hello@mandjack.digital.");
        } catch (mailErr: any) {
          console.error("[Server Error] Failed sending support email:", mailErr.message);
          emailError = mailErr.message;
        }
      }

      return res.json({
        success: true,
        savedLocally: true,
        emailSent,
        emailError: emailError || null,
        message: "Details received. A human representative will follow up with you shortly!",
      });
    } catch (err: any) {
      console.error("[Support Handover Error]:", err);
      return res.status(500).json({ success: false, error: err.message || "Internal server error." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Development mode: Vite middleware attached.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[Server] Production mode: Serving static files from", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Core service online & listening on port ${PORT}`);
  });
}

startServer();
