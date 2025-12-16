import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAdminAuth } from "@/lib/auth";
import { createBlogSchema, validateData } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
  paginatedResponse,
  getPaginationParams,
} from "@/lib/api-response";

// GET /api/blogs - Get all blogs (public)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(url);

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count(),
    ]);

    return paginatedResponse(
      blogs,
      total,
      page,
      limit,
      "Blogs retrieved successfully"
    );
  } catch (error) {
    return serverErrorResponse("Failed to fetch blogs", error);
  }
}

// POST /api/blogs - Create a new blog (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyRequestAdminAuth(request);
    if (!admin) {
      return unauthorizedResponse("Admin authentication required");
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(createBlogSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { slug, title, subtitle, description, content, image } =
      validation.data;

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return errorResponse("Blog with this slug already exists", 409);
    }

    // Create blog
    const blog = await prisma.blog.create({
      data: {
        slug,
        title,
        subtitle: subtitle || "",
        description: description || "",
        content,
        image,
      },
    });

    return successResponse(blog, "Blog created successfully", 201);
  } catch (error) {
    return serverErrorResponse("Failed to create blog", error);
  }
}
