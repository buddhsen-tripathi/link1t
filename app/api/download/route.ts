import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  // Only allow downloading from the documents folder
  if (!key.startsWith("documents/")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 403 });
  }

  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );

    if (!response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Derive a clean filename from the key
    const extension = key.split(".").pop() || "pdf";
    const filename = `resume.${extension}`;

    // Stream the response body
    const bytes = await response.Body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
