import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const explicitType = searchParams.get("type"); // Get explicit MIME type from Client (DB)
  
  // Await params in Next.js 15+ environments just to be safe, though 14 is sync usually. 
  // In App Router route handlers, params is dynamic.
  const { filename } = await params;

  if (!url || !filename) {
    return new NextResponse("Missing url or filename", { status: 400 });
  }

  // File name decoding (handling URL encoded path)
  const decodedFilename = decodeURIComponent(filename);

  console.log(`[Download API] Path Request for: ${decodedFilename} (URL: ${url}, Type: ${explicitType})`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`[Download API] Upstream fetch failed: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // ---------------------------------------------------------
    // SMART EXTENSION HANDLING
    // ---------------------------------------------------------
    // Prioritize explicit type from DB, fall back to upstream header, then default
    const contentType = explicitType || response.headers.get("Content-Type") || "application/octet-stream";
    let finalFilename = decodedFilename;

    // Map common MIME types to extensions
    const mimeMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "application/pdf": ".pdf",
        "text/plain": ".txt",
        "application/zip": ".zip",
        "application/json": ".json",
        "image/svg+xml": ".svg"
    };

    // If we have a known MIME type
    if (mimeMap[contentType]) {
        const ext = mimeMap[contentType];
        // If the filename DOES NOT end with the extension (case-insensitive), append it
        if (!finalFilename.toLowerCase().endsWith(ext)) {
            finalFilename = `${finalFilename}${ext}`;
        }
    }

    const headers = new Headers();
    
    // Strict sanitization for the "filename=" fallback
    const asciiFilename = finalFilename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const encodedFilenameHeader = encodeURIComponent(finalFilename).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');

    console.log(`[Download API] Final Filename: ${finalFilename} (Content-Type: ${contentType})`);

    headers.set("Content-Disposition", `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilenameHeader}`);
    headers.set("Content-Type", contentType);

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
