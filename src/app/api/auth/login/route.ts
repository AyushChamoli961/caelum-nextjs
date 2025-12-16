import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { loginSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      userType: user.userType,
    });

    // Set auth cookie
    await setAuthCookie(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        token,
      },
      "Login successful"
    );
  } catch (error) {
    return serverErrorResponse("Failed to login", error);
  }
}
