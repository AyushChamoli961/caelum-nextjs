import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { updateBlogSchema, validateData } from "@/lib/validations";
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

// GET /api/blogs/[slug] - Get a single blog by slug (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      return notFoundResponse("Blog not found");
    }

    return successResponse(blog, "Blog retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to fetch blog", error);
  }
}

// PUT /api/blogs/[slug] - Update a blog (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(updateBlogSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!existingBlog) {
      return notFoundResponse("Blog not found");
    }

    // If slug is being changed, check for conflicts
    if (validation.data.slug && validation.data.slug !== slug) {
      const slugConflict = await prisma.blog.findUnique({
        where: { slug: validation.data.slug },
      });

      if (slugConflict) {
        return errorResponse("Blog with this slug already exists", 409);
      }
    }

    // Update blog
    const blog = await prisma.blog.update({
      where: { slug },
      data: validation.data,
    });

    return successResponse(blog, "Blog updated successfully");
  } catch (error) {
    return serverErrorResponse("Failed to update blog", error);
  }
}

// DELETE /api/blogs/[slug] - Delete a blog (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!existingBlog) {
      return notFoundResponse("Blog not found");
    }

    // Delete blog
    await prisma.blog.delete({
      where: { slug },
    });

    return successResponse(null, "Blog deleted successfully");
  } catch (error) {
    return serverErrorResponse("Failed to delete blog", error);
  }
}
