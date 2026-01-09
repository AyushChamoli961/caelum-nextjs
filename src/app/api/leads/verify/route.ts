import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone and OTP are required." },
        { status: 400 }
      );
    }

    // Dummy OTP for testing
    if (otp !== "123456") {
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 401 }
      );
    }

    const lead = await prisma.lead.findFirst({
      where: { phone: String(phone) },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found." },
        { status: 404 }
      );
    }

    await prisma.lead.update({
      where: { id: lead.id },
      data: { verified: true },
    });

    return NextResponse.json({
      success: true,
      message: "Lead verified successfully!",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Server error verifying OTP." },
      { status: 500 }
    );
  }
}
