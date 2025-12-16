import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { createSeoPageSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
  paginatedResponse,
  getPaginationParams,
} from "@/lib/api-response";

// GET /api/seo - Get all SEO pages (admin only for listing)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(url);

    const [seoPages, total] = await Promise.all([
      prisma.seoPage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.seoPage.count(),
    ]);

    return paginatedResponse(
      seoPages,
      total,
      page,
      limit,
      "SEO pages retrieved successfully"
    );
  } catch (error) {
    return serverErrorResponse("Failed to fetch SEO pages", error);
  }
}

// POST /api/seo - Create a new SEO page (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(createSeoPageSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const data = validation.data;

    // Check if slug already exists
    const existingPage = await prisma.seoPage.findUnique({
      where: { slug: data.slug },
    });

    if (existingPage) {
      return errorResponse("SEO page with this slug already exists", 409);
    }

    // Create SEO page
    const seoPage = await prisma.seoPage.create({
      data,
    });

    return successResponse(seoPage, "SEO page created successfully", 201);
  } catch (error) {
    return serverErrorResponse("Failed to create SEO page", error);
  }
}
