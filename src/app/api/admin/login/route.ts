import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyPassword,
  generateAdminToken,
  setAdminAuthCookie,
} from "@/lib/auth";
import { adminLoginSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(adminLoginSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { email, password } = validation.data;

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return errorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.passwordHash);
    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate token
    const token = generateAdminToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Set auth cookie
    await setAdminAuthCookie(token);

    // Return admin without password
    const { passwordHash: _, ...adminWithoutPassword } = admin;

    return successResponse(
      {
        admin: adminWithoutPassword,
        token,
      },
      "Login successful"
    );
  } catch (error) {
    return serverErrorResponse("Failed to login", error);
  }
}
