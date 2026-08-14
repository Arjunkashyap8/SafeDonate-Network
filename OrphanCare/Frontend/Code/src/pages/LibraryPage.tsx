// src/pages/LibraryPage.tsx
import React, { useState, useMemo } from "react";
import type { Book } from "../types/books";
import { recommendBooks } from "../utils/recommendation";
import BookCard from "../components/BookCard";
import styles from "../styles/Library.module.css";

/** Mock library items (replace with real fetch later) */
const MOCK_BOOKS: Book[] = [
  {
    id: "b-stories-1",
    title: "The Little Kite (Story)",
    author: "A. Storyteller",
    category: "Stories",
    level: "Beginner",
    description: "A short, colorful story about a kite and courage.",
    tags: ["stories", "kids", "moral"],
    popularity: 8,
    cover: ""
  },
  {
    id: "b-math-1",
    title: "Abacus for Beginners",
    author: "Math Guru",
    category: "Math",
    level: "Beginner",
    description: "Learn counting and arithmetic using the abacus.",
    tags: ["math", "abacus", "counting"],
    popularity: 10,
    cover: ""
  },
  {
    id: "b-science-1",
    title: "Science Encyclopedia",
    author: "S. Knowledge",
    category: "Science",
    level: "Intermediate",
    description: "A simple encyclopedia covering basic science topics.",
    tags: ["science", "encyclopedia"],
    popularity: 7,
    cover: ""
  },
  {
    id: "b-stories-2",
    title: "Brave Little Elephant",
    author: "C. Tales",
    category: "Stories",
    level: "Beginner",
    description: "A charming story about friendship and problem solving.",
    tags: ["stories", "friendship"],
    popularity: 6,
    cover: ""
  }
];

export default function LibraryPage() {
  const [books] = useState<Book[]>(MOCK_BOOKS);
  const [selected, setSelected] = useState<Book | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const recommendations = useMemo(() => {
    // if a book is selected, recommend around it; else show popular
    const baseId = selected ? selected.id : null;
    return recommendBooks(books, baseId, 4);
  }, [books, selected]);

  const toggleFavorite = (id: string) => {
    setFavorites((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Library — Books & Resources</div>
          <div className={styles.subtitle}>Stories, math guides, and reference books for students.</div>
        </div>
      </div>

      {!selected ? (
        <div>
          <div className={styles.grid}>
            {books.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                onView={() => setSelected(b)}
                isFavorite={!!favorites[b.id]}
                onToggleFavorite={() => toggleFavorite(b.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button className={styles.backBtn} onClick={() => setSelected(null)}>← Back to Library</button>

          <div className={styles.detailWrap}>
            <div className={styles.detailLeft}>
              <div className={styles.detailCover}>
                <img src={selected.cover || "/placeholder-book.png"} alt={selected.title} />
              </div>

              <h2>{selected.title}</h2>
              <div className={styles.detailMeta}>
                <strong>{selected.author}</strong> • {selected.category} • {selected.level}
              </div>

              <p className={styles.detailDesc}>{selected.description}</p>

              <div style={{ marginTop: 12 }}>
                <button className={styles.startBtn}>Open Resource</button>
                <button className={styles.backBtn} onClick={() => toggleFavorite(selected.id)} style={{ marginLeft: 8 }}>
                  {favorites[selected.id] ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            </div>

            <aside className={styles.detailRight}>
              <h4>Recommended for you</h4>
              <div className={styles.gridSmall}>
                {recommendations.map((r) => (
                  <BookCard
                    key={r.id}
                    book={r}
                    onView={() => setSelected(r)}
                    isFavorite={!!favorites[r.id]}
                    onToggleFavorite={() => toggleFavorite(r.id)}
                  />
                ))}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
