import { clearAuthCookie } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function POST() {
  try {
    await clearAuthCookie();
    return successResponse(null, "Logged out successfully");
  } catch (error) {
    return serverErrorResponse("Failed to logout", error);
  }
}

export async function GET() {
  try {
    await clearAuthCookie();
    return successResponse(null, "Logged out successfully");
  } catch (error) {
    return serverErrorResponse("Failed to logout", error);
  }
}
