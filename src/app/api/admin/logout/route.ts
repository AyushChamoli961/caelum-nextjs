import { clearAdminAuthCookie } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function POST() {
  try {
    await clearAdminAuthCookie();
    return successResponse(null, "Logged out successfully");
  } catch (error) {
    return serverErrorResponse("Failed to logout", error);
  }
}
