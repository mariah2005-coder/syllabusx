import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeneratedFlashcard {
  question: string;
  answer: string;
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

function extractJsonString(rawText: string): string {
  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Gemini response did not contain valid JSON.");
  }

  return rawText.slice(firstBrace, lastBrace + 1);
}

function validateFlashcards(topic: any, topicIndex: number): GeneratedTopicChunk {
  const title = typeof topic?.title === "string" ? topic.title.trim() : "";
  if (!title) {
    throw new Error(`Invalid topic title for topic ${topicIndex + 1}.`);
  }

  if (!Array.isArray(topic.flashcards) || topic.flashcards.length === 0) {
    throw new Error(`Topic "${title}" must include 2-3 flashcards.`);
  }

  const flashcards = topic.flashcards.map((flashcard: any, flashcardIndex: number) => {
    const question = typeof flashcard?.question === "string" ? flashcard.question.trim() : "";
    const answer = typeof flashcard?.answer === "string" ? flashcard.answer.trim() : "";

    if (!question || !answer) {
      throw new Error(`Flashcard ${flashcardIndex + 1} in topic "${title}" is missing a question or answer.`);
    }

    return { question, answer };
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
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 1200,
    },
  });

  const prompt = `You are building simplified study material for neurodivergent students. Convert the document text into structured JSON only. Return 4-6 topic chunks. Each topic chunk should contain a title and 2-3 flashcards. Each flashcard must have a question and an answer. Use this exact JSON shape:\n\n{\n  "topics": [\n    {\n      "title": "...",\n      "flashcards": [\n        { "question": "...", "answer": "..." }\n      ]\n    }\n  ]\n}\n\nDocument text:\n${documentText}`;

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

    const topics = topicsSource.map(validateFlashcards);
    if (topics.length === 0) {
      throw new Error("Gemini response contained no valid topic chunks.");
    }

    return { topics };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Gemini flashcard generation failed: ${message}`);
  }
}
