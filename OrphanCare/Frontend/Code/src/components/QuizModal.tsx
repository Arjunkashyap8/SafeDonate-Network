// src/components/QuizModal.tsx
import React, { useState, useEffect } from "react";
import styles from "../styles/RoadmapPage.module.css";

export type MCQ = {
  id: string;
  question: string;
  choices: string[];
  answerIndex: number;
};

type QuizModalProps = {
  open: boolean;
  onClose: () => void;
  questions: MCQ[];
  onComplete: (scorePercent: number) => void;
};

export default function QuizModal({ open, onClose, questions, onComplete }: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);

  // Reset when reopened
  useEffect(() => {
    if (open) {
      setAnswers({});
      setSubmitted(false);
      setScorePercent(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSelect = (qid: string, idx: number) => {
    if (submitted) return;
    setAnswers((s) => ({ ...s, [qid]: idx }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answerIndex) correct += 1;
    });
    const percent = Math.round((correct / questions.length) * 100);
    setSubmitted(true);
    setScorePercent(percent);
  };

  const handleFinish = () => {
    if (scorePercent !== null) {
      onComplete(scorePercent);
    }
    onClose();
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className={styles.quizOverlay} role="dialog" aria-modal="true">
      <div className={styles.quizCard}>
        <div className={styles.quizHeader}>
          <h3 className={styles.quizTitle}>Group Quiz</h3>
          <button className={styles.backBtn} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.quizBody}>
          {questions.map((q, idx) => {
            const sel = answers[q.id];
            return (
              <div key={q.id} className={styles.quizQuestion}>
                <div className={styles.quizQText}>
                  <strong>{idx + 1}.</strong> {q.question}
                </div>
                <div className={styles.quizChoices}>
                  {q.choices.map((c, i) => {
                    const isSelected = sel === i;
                    const isCorrect = submitted && q.answerIndex === i;
                    const isWrongSelected =
                      submitted && isSelected && q.answerIndex !== i;
                    return (
                      <button
                        key={i}
                        className={`${styles.choiceBtn} 
                          ${isSelected ? styles.choiceSelected : ""} 
                          ${isCorrect ? styles.choiceCorrect : ""} 
                          ${isWrongSelected ? styles.choiceWrong : ""}`}
                        onClick={() => handleSelect(q.id, i)}
                        disabled={submitted}
                      >
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.quizFooter}>
          {!submitted ? (
            <>
              <div className={styles.quizMeta}>
                <div>
                  {answeredCount}/{questions.length} answered
                </div>
              </div>
              <div>
                <button
                  className={styles.startBtn}
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  title={
                    answeredCount < questions.length
                      ? "Answer all questions"
                      : "Submit quiz"
                  }
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", width: "100%" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                You scored {scorePercent}%!
              </div>
              <button className={styles.startBtn} onClick={handleFinish}>
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
