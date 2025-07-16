import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";

let serviceAccountAuth: JWT;
try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    // console.log(privateKey);
    
    if (!clientEmail || !privateKey) {
        throw new Error("Missing required environment variables");
    }
    
    serviceAccountAuth = new JWT({
        email: clientEmail,
        key: privateKey, // 
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("✅ Service account credentials loaded successfully");
} catch (error: any) {
    console.error(
        "❌ Error loading service account credentials:",
        error instanceof Error ? error.message : error
    );
    console.log(
        "📝 Please make sure you have service-account-key.json in your project root"
    );
    process.exit(1);
}

const SPREADSHEET_ID =
    process.env.SPREADSHEET_ID ||
    "1suISRmLvuKluE7-ewDG_qnDUi2IeyXumzAx0VQawRhA"


export async function initializeSheet() {
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
        console.error("❌ Error initializing sheet:", error instanceof Error ? error.message : error);
        throw error;
    }
}