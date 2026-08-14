// src/types/books.ts
export type Book = {
  id: string;
  title: string;
  author?: string;
  category?: string; // e.g. "Stories", "Math", "Science"
  level?: "Beginner" | "Intermediate" | "Advanced";
  description?: string;
  cover?: string; // url to image
  resourceUrl?: string; // pdf/video
  popularity?: number;
  tags?: string[];
};
