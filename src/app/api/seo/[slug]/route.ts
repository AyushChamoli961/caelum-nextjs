import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { updateSeoPageSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/seo/[slug] - Get SEO data for a page (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Decode the slug (handles URL-encoded slashes)
    const decodedSlug = decodeURIComponent(slug);

    const seoPage = await prisma.seoPage.findUnique({
      where: { slug: decodedSlug },
    });

    if (!seoPage) {
      // Return default SEO data if page not found
      return successResponse(
        {
          slug: decodedSlug,
          title: "Caelum",
          description: "Transform your school investment journey with Caelum",
          keywords: [],
          isActive: true,
        },
        "Default SEO data"
      );
    }

    return successResponse(seoPage, "SEO data retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to fetch SEO data", error);
  }
}

// PUT /api/seo/[slug] - Update SEO page (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(updateSeoPageSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    // Check if page exists
    const existingPage = await prisma.seoPage.findUnique({
      where: { slug: decodedSlug },
    });

    if (!existingPage) {
      return notFoundResponse("SEO page not found");
    }

    // If slug is being changed, check for conflicts
    if (validation.data.slug && validation.data.slug !== decodedSlug) {
      const slugConflict = await prisma.seoPage.findUnique({
        where: { slug: validation.data.slug },
      });

      if (slugConflict) {
        return errorResponse("SEO page with this slug already exists", 409);
      }
    }

    // Update SEO page
    const seoPage = await prisma.seoPage.update({
      where: { slug: decodedSlug },
      data: validation.data,
    });

    return successResponse(seoPage, "SEO page updated successfully");
  } catch (error) {
    return serverErrorResponse("Failed to update SEO page", error);
  }
}

// DELETE /api/seo/[slug] - Delete SEO page (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    // Check if page exists
    const existingPage = await prisma.seoPage.findUnique({
      where: { slug: decodedSlug },
    });

    if (!existingPage) {
      return notFoundResponse("SEO page not found");
    }

    // Delete SEO page
    await prisma.seoPage.delete({
      where: { slug: decodedSlug },
    });

    return successResponse(null, "SEO page deleted successfully");
  } catch (error) {
    return serverErrorResponse("Failed to delete SEO page", error);
  }
}
