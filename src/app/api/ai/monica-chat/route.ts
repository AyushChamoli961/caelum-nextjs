import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRequestAuth } from "@/lib/auth";
import { chatMessageSchema, validateData } from "@/lib/validations";
import { generateMonicaResponse } from "@/lib/openai";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(chatMessageSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 422);
    }

    const { sessionId, userMessage } = validation.data;

    // Get user if authenticated (optional)
    const user = await verifyRequestAuth(request);

    // Get conversation history for context
    const previousChats = await prisma.monicaChat.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 10, // Last 10 messages for context
    });

    const conversationHistory = previousChats.flatMap((chat) => [
      { role: "user" as const, content: chat.userMessage },
      { role: "assistant" as const, content: chat.botResponse },
    ]);

    // Generate AI response
    const botResponse = await generateMonicaResponse(
      userMessage,
      conversationHistory
    );

    // Save chat to database
    const chat = await prisma.monicaChat.create({
      data: {
        sessionId,
        userId: user?.userId || null,
        userMessage,
        botResponse,
      },
    });

    return successResponse(
      {
        sessionId: chat.sessionId,
        userMessage: chat.userMessage,
        botResponse: chat.botResponse,
        createdAt: chat.createdAt,
      },
      "Response generated successfully"
    );
  } catch (error) {
    console.error("Monica chat error:", error);
    return serverErrorResponse("Failed to generate response", error);
  }
}

// GET chat history for a session
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return errorResponse("Session ID is required", 400);
    }

    const chats = await prisma.monicaChat.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        userMessage: true,
        botResponse: true,
        createdAt: true,
      },
    });

    return successResponse(chats, "Chat history retrieved successfully");
  } catch (error) {
    return serverErrorResponse("Failed to fetch chat history", error);
  }
}
