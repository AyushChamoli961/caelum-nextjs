import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { revenueSchema, validateData } from "@/lib/validations";
import { calculateRevenue } from "@/lib/calculator";
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
    const validation = validateData(revenueSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { noofStudents, potentialBuiltUp } = validation.data;

    // Calculate revenue
    const result = calculateRevenue(noofStudents, potentialBuiltUp);

    // Save to database
    await prisma.realisedRevenuePotential.create({
      data: {
        noofStudents: new Decimal(result.noofStudents),
        potentialBuiltUp: result.potentialBuiltUp
          ? new Decimal(result.potentialBuiltUp)
          : null,
        realisedRevenuePotential: new Decimal(result.realisedRevenuePotential),
      },
    });

    return successResponse(result, "Revenue calculated successfully");
  } catch (error) {
    return serverErrorResponse("Failed to calculate revenue", error);
  }
}

export async function GET() {
  try {
    // Get recent calculations
    const calculations = await prisma.realisedRevenuePotential.findMany({
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
