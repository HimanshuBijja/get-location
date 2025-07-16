import { initializeSheet } from "@/utils/initializeSheet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){

    try {
        const sheet = await initializeSheet();
        const rows = await sheet.getRows();
        return NextResponse.json({
            success: true,
            count: rows.length,
            data: rows.map((row) => row.toObject()),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message });
    }
}