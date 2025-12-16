import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { feasibilitySchema, validateData } from "@/lib/validations";
import {
  calculateFeasibility,
  isValidCategory,
  FeasibilityCategory,
} from "@/lib/calculator";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(feasibilitySchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { landSize, category } = validation.data;

    // Validate category
    if (!isValidCategory(category)) {
      return errorResponse(
        "Invalid category. Must be one of: Budget, Mid-Segment, Premium, Ultra-Premium",
        422
      );
    }

    // Calculate feasibility
    const result = calculateFeasibility(
      landSize,
      category as FeasibilityCategory
    );

    // Save to database
    await prisma.feasibilityChecker.create({
      data: {
        landSize: new Decimal(result.landSize),
        potentialBuiltUp: new Decimal(result.potentialBuiltUp),
        computedValue: new Decimal(result.computedValue),
        category: result.category,
      },
    });

    return successResponse(result, "Feasibility calculated successfully");
  } catch (error) {
    return serverErrorResponse("Failed to calculate feasibility", error);
  }
}

export async function GET() {
  try {
    // Get recent calculations
    const calculations = await prisma.feasibilityChecker.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return successResponse(
      calculations,
      "Recent calculations retrieved successfully"
    );
  } catch (error) {
    return serverErrorResponse("Failed to fetch calculations", error);
  }
}
