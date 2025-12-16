import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { updateFaqSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/faqs/[id] - Get a single FAQ (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const faq = await prisma.blogFaq.findUnique({
      where: { id },
    });

    if (!faq) {
      return notFoundResponse("FAQ not found");
    }

    return successResponse(faq, "FAQ retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to fetch FAQ", error);
  }
}

// PUT /api/faqs/[id] - Update a FAQ (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(updateFaqSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    // Check if FAQ exists
    const existingFaq = await prisma.blogFaq.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return notFoundResponse("FAQ not found");
    }

    // Update FAQ
    const faq = await prisma.blogFaq.update({
      where: { id },
      data: validation.data,
    });

    return successResponse(faq, "FAQ updated successfully");
  } catch (error) {
    return serverErrorResponse("Failed to update FAQ", error);
  }
}

// DELETE /api/faqs/[id] - Delete a FAQ (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    // Check if FAQ exists
    const existingFaq = await prisma.blogFaq.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return notFoundResponse("FAQ not found");
    }

    // Delete FAQ
    await prisma.blogFaq.delete({
      where: { id },
    });

    return successResponse(null, "FAQ deleted successfully");
  } catch (error) {
    return serverErrorResponse("Failed to delete FAQ", error);
  }
}
