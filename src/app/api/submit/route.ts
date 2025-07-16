import { initializeSheet } from "@/utils/initializeSheet";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
      const { name, email, phone, category, message } = await request.json();
      
      // Validate required fields
      if (!name || !email) {
        return NextResponse.json({
          success: false,
          message: 'Name and email are required'
        });
      }
      
      console.log('📝 Submitting data:', { name, email, phone, category });
      
      // Initialize sheet
      const sheet = await initializeSheet();
      
      // Add row to sheet
      await sheet.addRow({
        Timestamp: new Date().toLocaleString(),
        Name: name,
        Email: email,
        Phone: phone || '',
        Category: category || '',
        Message: message || ''
      });
      
      console.log('✅ Data added to sheet successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Data submitted successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error submitting data:', error instanceof Error ? error.message : error);
      return NextResponse.json({
        success: false,
        message: 'Error submitting data',
        error: error instanceof Error ? error.message : error
      });
    }
}