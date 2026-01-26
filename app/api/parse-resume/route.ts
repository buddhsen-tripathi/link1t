import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

// GET endpoint to check rate limit status
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: user } = await supabase
      .from("users")
      .select("ai_usage")
      .eq("clerk_id", userId)
      .single();

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    let aiUsage: number[] = user?.ai_usage || [];
    aiUsage = aiUsage.filter((timestamp: number) => timestamp > windowStart);

    const remaining = Math.max(0, RATE_LIMIT_MAX - aiUsage.length);
    const resetInMinutes = aiUsage.length > 0
      ? Math.ceil((Math.min(...aiUsage) + RATE_LIMIT_WINDOW_MS - now) / 60000)
      : null;

    return NextResponse.json({
      remaining,
      total: RATE_LIMIT_MAX,
      resetInMinutes,
      windowMinutes: 30
    });
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get user's AI usage from the database
    const { data: user } = await supabase
      .from("users")
      .select("ai_usage")
      .eq("clerk_id", userId)
      .single();

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Parse existing usage or initialize empty array
    let aiUsage: number[] = user?.ai_usage || [];

    // Filter to only include timestamps within the window
    aiUsage = aiUsage.filter((timestamp: number) => timestamp > windowStart);

    // Check if rate limit exceeded
    if (aiUsage.length >= RATE_LIMIT_MAX) {
      const oldestUse = Math.min(...aiUsage);
      const resetTime = oldestUse + RATE_LIMIT_WINDOW_MS;
      const minutesUntilReset = Math.ceil((resetTime - now) / 60000);

      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can use AI parsing ${RATE_LIMIT_MAX} times per 30 minutes.`,
          rateLimited: true,
          remaining: 0,
          resetInMinutes: minutesUntilReset
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (PDF only for now)
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Convert PDF to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Call OpenRouter API for extraction
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Link1t Portfolio Generator",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract the following information from this resume PDF and return it as JSON:

{
  "fullName": "string",
  "title": "string (job title/professional title)",
  "email": "string",
  "phone": "string",
  "location": "string",
  "bio": "string (professional summary/about section)",
  "experiences": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or empty if current",
      "isCurrent": boolean,
      "description": "string (responsibilities/achievements)"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "Frontend|Backend|Database|DevOps|Mobile|Design|Tools|Languages|Frameworks|Other"
    }
  ],
  "socialLinks": [
    {
      "platform": "github|linkedin|twitter|website",
      "url": "string"
    }
  ]
}

Only return the JSON object, no other text. If a field cannot be determined, use an empty string or empty array.`,
              },
              {
                type: "file",
                file: {
                  filename: file.name,
                  file_data: `data:application/pdf;base64,${base64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to parse resume" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content in response" },
        { status: 500 }
      );
    }

    // Try to parse the JSON response
    try {
      // Clean up the response (remove markdown code blocks if present)
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const parsed = JSON.parse(jsonStr);

      // Track successful usage
      aiUsage.push(now);
      await supabase
        .from("users")
        .update({ ai_usage: aiUsage })
        .eq("clerk_id", userId);

      // Return parsed data with rate limit info
      return NextResponse.json({
        ...parsed,
        _rateLimit: {
          remaining: RATE_LIMIT_MAX - aiUsage.length,
          resetInMinutes: aiUsage.length > 0 ? Math.ceil((Math.min(...aiUsage) + RATE_LIMIT_WINDOW_MS - now) / 60000) : 30
        }
      });
    } catch (parseError) {
      console.error("Failed to parse JSON response:", content);
      return NextResponse.json(
        { error: "Failed to parse resume data", raw: content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
