// src/components/BookCard.tsx
import React from "react";
import type { Book } from "../types/books";
import styles from "../styles/Library.module.css";

type Props = {
  book: Book;
  onView?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export default function BookCard({ book, onView, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className={styles.bookCard} onClick={() => onView?.()}>
      <div className={styles.bookCoverWrap}>
        <img
          src={book.cover ?? "/placeholder-book.png"}
          alt={book.title}
          className={styles.bookCover}
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <div className={styles.bookTitle}>{book.title}</div>
          <button
            className={styles.favBtn}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
            aria-label="toggle favorite"
            title="Toggle favorite"
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>

        <div className={styles.cardMeta}>
          <span className={styles.cardCategory}>{book.category}</span>
          {book.level ? <span className={styles.cardLevel}> • {book.level}</span> : null}
        </div>

        <p className={styles.cardDesc}>{book.description}</p>

        <div className={styles.cardFooter}>
          <button className={styles.startBtn} onClick={(e) => { e.stopPropagation(); onView?.(); }}>
            Open
          </button>

          <div className={styles.tags}>
            {(book.tags || []).slice(0, 3).map((t) => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
