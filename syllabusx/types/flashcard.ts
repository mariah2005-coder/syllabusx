export type FlashcardStatus = "unreviewed" | "known" | "needsReview";

export interface Flashcard {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  status: FlashcardStatus;
}
