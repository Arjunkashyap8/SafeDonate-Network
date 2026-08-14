// src/utils/recommendation.ts
import type { Book } from "../types/books"; 


export function recommendBooks(all: Book[], baseBookId: string | null, limit = 4): Book[] {
  if (!baseBookId) {
    return [...all]
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, limit);
  }

  const base = all.find((b) => b.id === baseBookId);
  if (!base) return recommendBooks(all, null, limit);

  const baseTags = new Set((base.tags || []).map((t) => t.toLowerCase()));

  const pops = all.map((b) => b.popularity ?? 0);
  const maxPop = Math.max(...pops, 1);

  return all
    .filter((b) => b.id !== baseBookId)
    .map((b) => {
      const tags = (b.tags || []).map((t) => t.toLowerCase());
      let overlap = 0;
      tags.forEach((t) => {
        if (baseTags.has(t)) overlap += 1;
      });
      const popScore = (b.popularity ?? 0) / maxPop;
      const score = overlap * 3 + popScore * 1;
      return { book: b, score };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.book);
}
