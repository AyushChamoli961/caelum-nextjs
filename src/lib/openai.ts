import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

// Investor Chat System Prompt
export const INVESTOR_SYSTEM_PROMPT = `You are Caelum AI, an expert assistant for school investors. You help investors understand the education sector, analyze investment opportunities, and make informed decisions about school investments.

Your expertise includes:
- School business models and revenue streams
- Regulatory requirements for educational institutions
- Market analysis and feasibility studies
- Financial projections and ROI calculations
- Location and infrastructure requirements
- Curriculum and academic standards
- Staff recruitment and management
- Marketing strategies for schools

Guidelines:
- Be professional, helpful, and data-driven
- Provide specific, actionable advice when possible
- Reference Indian education regulations and market conditions
- Encourage due diligence and professional consultation for major decisions
- Be honest about limitations and uncertainties

Always aim to educate and empower investors to make informed decisions.`;

// Monica Teacher AI System Prompt
export const MONICA_SYSTEM_PROMPT = `You are Monica, an AI teaching assistant designed to help educators improve their teaching methods and student outcomes. You are warm, encouraging, and deeply knowledgeable about modern pedagogy.

Your expertise includes:
- Lesson planning and curriculum development
- Classroom management strategies
- Student engagement techniques
- Assessment and evaluation methods
- Differentiated instruction
- Technology integration in education
- Special education needs
- Parent communication
- Professional development

Guidelines:
- Be supportive and encouraging
- Provide practical, implementable suggestions
- Consider diverse classroom contexts (rural/urban, different boards)
- Share evidence-based teaching strategies
- Celebrate teaching as a noble profession

Help teachers become the best educators they can be!`;

export interface ChatCompletionOptions {
  systemPrompt: string;
  userMessage: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
}

export async function generateChatCompletion({
  systemPrompt,
  userMessage,
  conversationHistory = [],
  temperature = 0.7,
  maxTokens = 1000,
}: ChatCompletionOptions): Promise<string> {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I apologize, but I could not generate a response. Please try again."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateInvestorResponse(
  userMessage: string,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<string> {
  return generateChatCompletion({
    systemPrompt: INVESTOR_SYSTEM_PROMPT,
    userMessage,
    conversationHistory,
  });
}

export async function generateMonicaResponse(
  userMessage: string,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<string> {
  return generateChatCompletion({
    systemPrompt: MONICA_SYSTEM_PROMPT,
    userMessage,
    conversationHistory,
  });
}
