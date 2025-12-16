import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { registerSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(registerSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { name, email, password, userType } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine role based on user type
    const role: UserRole =
      userType === "SuperAdmin"
        ? UserRole.SuperAdmin
        : userType === "Investor"
        ? UserRole.Investor
        : UserRole.Teacher;

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType,
        role,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      userType: user.userType,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        token,
      },
      "Registration successful",
      201
    );
  } catch (error) {
    return serverErrorResponse("Failed to register user", error);
  }
}
