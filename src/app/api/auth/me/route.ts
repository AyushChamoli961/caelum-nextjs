import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAuth } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyRequestAuth(request);
    if (!payload) {
      return unauthorizedResponse("Not authenticated");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { userId: payload.userId },
      select: {
        userId: true,
        name: true,
        email: true,
        userType: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return notFoundResponse("User not found");
    }

    return successResponse(user, "User retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to get user", error);
  }
}
