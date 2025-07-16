import express, { Request, Response } from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Load service account credentials from file or env
let serviceAccountAuth: JWT;
try {
    const serviceAccountKey = JSON.parse(
        fs.readFileSync("./service-account-key.json", "utf-8")
    );
    serviceAccountAuth = new JWT({
        email: serviceAccountKey.client_email,
        key: serviceAccountKey.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("✅ Service account credentials loaded successfully");
} catch (error: any) {
    console.error(
        "❌ Error loading service account credentials:",
        error.message
    );
    console.log(
        "📝 Please make sure you have service-account-key.json in your project root"
    );
    process.exit(1);
}

// Replace this with your actual Google Sheet ID
const SPREADSHEET_ID =
    process.env.SPREADSHEET_ID ||
    "1suISRmLvuKluE7-ewDG_qnDUi2IeyXumzAx0VQawRhA";

// Initialize Google Spreadsheet
async function initializeSheet() {
    try {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        console.log(`📊 Connected to sheet: ${doc.title}`);
        let sheet = doc.sheetsByIndex[0];
        if (!sheet) {
            sheet = await doc.addSheet({ title: "Form Data" });
            console.log("📄 Created new sheet: Form Data");
        }
        const rows = await sheet.getRows();
        if (rows.length === 0) {
            await sheet.setHeaderRow([
                "Timestamp",
                "Name",
                "Email",
                "Phone",
                "Category",
                "Message",
            ]);
            console.log("📋 Headers added to sheet");
        }
        return sheet;
    } catch (error: any) {
        console.error("❌ Error initializing sheet:", error.message);
        throw error;
    }
}

// Test endpoint
app.get("/test", async (req: Request, res: Response) => {
    try {
        await initializeSheet();
        res.json({ success: true, message: "Connected to Google Sheets" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// View all data endpoint
app.get("/api/data", async (req: Request, res: Response) => {
    try {
        const sheet = await initializeSheet();
        const rows = await sheet.getRows();
        res.json({
            success: true,
            count: rows.length,
            data: rows.map((row) => row.toObject()),
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Contact form submission endpoint
app.post("/api/contact", async (req: Request, res: Response) => {
    try {
        const sheet = await initializeSheet();
        const { name, email, phone, category, message } = req.body;
        await sheet.addRow({
            Timestamp: new Date().toISOString(),
            Name: name,
            Email: email,
            Phone: phone || "",
            Category: category || "",
            Message: message || "",
        });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Serve the main HTML file
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        spreadsheetId: SPREADSHEET_ID,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🧪 Test connection: http://localhost:${PORT}/test`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log("");
    console.log("📋 Setup checklist:");
    console.log("   ✅ service-account-key.json file");
    console.log("   ⚠️  Update SPREADSHEET_ID in code");
    console.log("   ⚠️  Share sheet with service account email");
    console.log("   ⚠️  Create public/ folder with index.html");
});

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\n👋 Shutting down server...");
    process.exit(0);
});
