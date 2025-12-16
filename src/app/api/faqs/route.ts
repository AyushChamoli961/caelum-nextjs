import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { createFaqSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
  paginatedResponse,
  getPaginationParams,
} from "@/lib/api-response";

// GET /api/faqs - Get all FAQs (public)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(url);

    const [faqs, total] = await Promise.all([
      prisma.blogFaq.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogFaq.count(),
    ]);

    return paginatedResponse(
      faqs,
      total,
      page,
      limit,
      "FAQs retrieved successfully"
    );
  } catch (error) {
    return serverErrorResponse("Failed to fetch FAQs", error);
  }
}

// POST /api/faqs - Create a new FAQ (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(createFaqSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { question, answer } = validation.data;

    // Create FAQ
    const faq = await prisma.blogFaq.create({
      data: {
        blogId: body.blogId, // Ensure blogId is passed in the request body
        question,
        answer,
      },
    });

    return successResponse(faq, "FAQ created successfully", 201);
  } catch (error) {
    return serverErrorResponse("Failed to create FAQ", error);
  }
}
