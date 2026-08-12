import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeneratedFlashcard {
  question: string;
  answer: string;
  detail?: string;
}

export interface GeneratedTopicChunk {
  title: string;
  flashcards: GeneratedFlashcard[];
}

export interface GenerateFlashcardsResult {
  topics: GeneratedTopicChunk[];
}

function extractTextFromCandidateContent(content: any): string {
  if (!content?.parts || !Array.isArray(content.parts)) {
    return "";
  }

  return content.parts
    .map((part: any) => {
      if (typeof part === "string") {
        return part;
      }

      if (typeof part?.text === "string") {
        return part.text;
      }

      if (typeof part?.content === "string") {
        return part.content;
      }

      return "";
    })
    .join("");
}

export function extractJsonString(rawText: string): string {
  const cleaned = rawText
    .replace(/```(?:json)?/gi, "")
    .replace(/\r/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Gemini response did not contain valid JSON.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function validateFlashcards(topic: any, topicIndex: number, minFlashcards = 2, maxFlashcards = 3): GeneratedTopicChunk {
  const title = typeof topic?.title === "string" ? topic.title.trim() : "";
  if (!title) {
    throw new Error(`Invalid topic title for topic ${topicIndex + 1}.`);
  }

  if (!Array.isArray(topic.flashcards) || topic.flashcards.length === 0) {
    throw new Error(`Topic "${title}" must include between ${minFlashcards}-${maxFlashcards} flashcards.`);
  }

  if (topic.flashcards.length < minFlashcards || topic.flashcards.length > maxFlashcards) {
    throw new Error(`Topic "${title}" has ${topic.flashcards.length} flashcards; expected between ${minFlashcards}-${maxFlashcards}.`);
  }

  const flashcards = topic.flashcards.map((flashcard: any, flashcardIndex: number) => {
    const question = typeof flashcard?.question === "string" ? flashcard.question.trim() : "";
    const answer = typeof flashcard?.answer === "string" ? flashcard.answer.trim() : "";
    const detail = typeof flashcard?.detail === "string" && flashcard.detail.trim() ? flashcard.detail.trim() : undefined;

    if (!question || !answer) {
      throw new Error(`Flashcard ${flashcardIndex + 1} in topic "${title}" is missing a question or answer.`);
    }

    return detail ? { question, answer, detail } : { question, answer };
  });

  return { title, flashcards };
}

export async function generateFlashcards(documentText: string): Promise<GenerateFlashcardsResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  if (!documentText || !documentText.trim()) {
    throw new Error("Document text cannot be empty.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  // Estimate document length
  const words = documentText.trim().length === 0 ? 0 : documentText.trim().split(/\s+/).filter(Boolean).length;

  // Determine ranges based on size
  let minTopics = 4;
  let maxTopics = 6;
  let minFlashcards = 2;
  let maxFlashcards = 3;

  if (words >= 1500 && words <= 4000) {
    minTopics = 8;
    maxTopics = 12;
    minFlashcards = 3;
    maxFlashcards = 4;
  } else if (words > 4000) {
    minTopics = 12;
    maxTopics = 18;
    minFlashcards = 3;
    maxFlashcards = 4;
  }

    const prompt = `You are building simplified study material for neurodivergent students. Convert the document text into structured JSON only. Return between ${minTopics}-${maxTopics} topic chunks. Each topic chunk should contain a title and ${minFlashcards}-${maxFlashcards} flashcards. Each flashcard must include:\n- "question": a concise prompt (short)\n- "answer": a short 1-2 sentence core definition (concise)\n- "detail": OPTIONAL, 2-3 additional sentences with context, example, or elaboration for deeper understanding\nReturn only JSON that matches this exact shape (include the "detail" field when you provide extra context):\n\n{\n  "topics": [\n    {\n      "title": "...",\n      "flashcards": [\n        { "question": "...", "answer": "...", "detail": "... (optional)" }\n      ]\n    }\n  ]\n}\n\nDocument text (approx ${words} words):\n${documentText}`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const candidate = result?.response?.candidates?.[0];
    if (!candidate || !candidate.content) {
      throw new Error("Gemini returned an empty response.");
    }

    const rawText = extractTextFromCandidateContent(candidate.content);
    if (!rawText || !rawText.trim()) {
      throw new Error("Gemini returned empty text.");
    }
    

    const jsonString = extractJsonString(rawText);
    const parsed = JSON.parse(jsonString);

    const topicsSource = parsed?.topics;
    if (!Array.isArray(topicsSource) || topicsSource.length === 0) {
      throw new Error("Gemini response JSON did not contain a valid topics array.");
    }

    if (topicsSource.length < minTopics || topicsSource.length > maxTopics) {
      throw new Error(`Gemini returned ${topicsSource.length} topics; expected between ${minTopics} and ${maxTopics}.`);
    }

    const topics = topicsSource.map((t: any, i: number) => validateFlashcards(t, i, minFlashcards, maxFlashcards));
    if (topics.length === 0) {
      throw new Error("Gemini response contained no valid topic chunks.");
    }

    return { topics };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);

    // Detect retryable/service-unavailable errors from the Gemini client
    const isRetryable =
      (error && (error.status === 503 || error.code === 503)) || /503|service unavailable|Service Unavailable/i.test(message);

    const wrapped = new Error(`Gemini flashcard generation failed: ${message}`) as any;
    if (isRetryable) {
      wrapped.retryable = true;
      wrapped.status = 503;
    }

    throw wrapped;
  }
}
