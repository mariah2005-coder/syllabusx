import { NextRequest, NextResponse } from "next/server";
import { generateFlashcards } from "../../../lib/gemini";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  let body: any;

  try {
    body = await request.json();
  } catch (error) {
    return jsonError("Request body must be valid JSON.");
  }

  const documentText = typeof body?.text === "string" ? body.text.trim() : "";
  if (!documentText) {
    return jsonError("Request must include extracted document text in the 'text' field.");
  }

  try {
    const result = await generateFlashcards(documentText);
    return NextResponse.json(result);
  } catch (error) {
    const err: any = error;
    const message = err instanceof Error ? err.message : "Flashcard generation failed.";

    if (err?.retryable) {
      return NextResponse.json({ error: "Our AI service is briefly busy — please try again in a moment.", retryable: true }, { status: 503 });
    }

    return jsonError(message, 502);
  }
}
