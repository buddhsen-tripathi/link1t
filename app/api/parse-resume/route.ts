import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json(parsed);
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
