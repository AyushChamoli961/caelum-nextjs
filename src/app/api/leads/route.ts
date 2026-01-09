import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const test = await req.json();
    const { name, email, phone, state, city, otp } = test;

    console.log("Received OTP verification request:", test);

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone and OTP are required." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { phone: String(phone) },
    });

    if (!lead) {
      await prisma.lead.create({
        data: {
          name,
          email,
          phone: String(phone),
          state,
          city,
          otp,
          verified: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Lead created successfully and saved in database.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Server error while verifying OTP." },
      { status: 500 }
    );
  }
}
