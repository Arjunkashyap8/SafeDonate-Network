// src/pages/RoadmapPage.tsx
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/RoadmapPage.module.css";
import { Play, BookOpen } from "lucide-react";
import QuizModal, { MCQ } from "../components/QuizModal";
import { updateSchedule, LessonSchedule } from "../utils/scheduler";

type Roadmap = {
  id: string;
  title: string;
  description: string;
  lessons: { id: string; title: string; duration: string }[];
};

const mockRoadmaps: Roadmap[] = [
  {
    id: "tech",
    title: "Web Development Roadmap",
    description: "Learn HTML, CSS, JavaScript, and React step by step.",
    lessons: [
      { id: "html", title: "Introduction to HTML", duration: "15 min" },
      { id: "css", title: "CSS Basics", duration: "20 min" },
      { id: "js", title: "JavaScript Fundamentals", duration: "30 min" },
      { id: "react", title: "React Basics", duration: "40 min" },
    ],
  },
  {
    id: "govt",
    title: "Government Exam Roadmap",
    description: "Prepare for SSC and Banking exams with structured lessons.",
    lessons: [
      { id: "apt", title: "Aptitude Basics", duration: "25 min" },
      { id: "math", title: "Quantitative Reasoning", duration: "35 min" },
      { id: "eng", title: "English Grammar", duration: "20 min" },
      { id: "gk", title: "General Knowledge", duration: "30 min" },
    ],
  },
];

// Example MCQs (group-level) per lesson id (mock)
const sampleMCQs: Record<string, MCQ[]> = {
  html: [
    { id: "q1", question: "What does HTML stand for?", choices: ["Hyper Text Markup Language", "Home Tool Markup Lang", "Hyperlinks and Text Markup"], answerIndex: 0 },
    { id: "q2", question: "Which tag is used for headings?", choices: ["<p>", "<h1>", "<div>"], answerIndex: 1 },
  ],
  css: [
    { id: "q1", question: "What property changes text color?", choices: ["background-color", "color", "font-size"], answerIndex: 1 },
    { id: "q2", question: "Which is used for layout with grid?", choices: ["display: grid", "float: right", "position: fixed"], answerIndex: 0 },
  ],
  js: [
    { id: "q1", question: "Which keyword declares a variable in JS?", choices: ["var/let/const", "int/float", "dim"], answerIndex: 0 },
    { id: "q2", question: "What is NaN?", choices: ["Not a Number", "Null and Null", "Number type"], answerIndex: 0 },
  ],
  react: [
    { id: "q1", question: "What is JSX?", choices: ["A templating engine", "JavaScript XML", "React hook"], answerIndex: 1 },
    { id: "q2", question: "How do you create a state in functional component?", choices: ["useState()", "setState()", "this.state"], answerIndex: 0 },
  ],
  apt: [
    { id: "q1", question: "If a+b=10 and a-b=2, then a=?", choices: ["6", "4", "8"], answerIndex: 0 },
    { id: "q2", question: "5 * 7 = ?", choices: ["30", "35", "40"], answerIndex: 1 },
  ],
  // ... add others as needed
};

/* ---------------------------
   Urgency helper
   --------------------------- */
function getUrgency(nextIso?: string | null) {
  if (!nextIso) return { label: "Not scheduled", className: styles.urgencyGray }; // gray
  const now = new Date();
  const next = new Date(nextIso);
  const diffMs = next.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return { label: "Due today", className: styles.urgencyRed }; // red
  if (diffDays <= 3) return { label: `In ${diffDays}d`, className: styles.urgencyOrange }; // orange
  return { label: `In ${diffDays}d`, className: styles.urgencyGreen }; // green
}

/* ---------------------------
   Helper: find due/overdue lessons
   --------------------------- */
function getDueLessons(schedules: Record<string, LessonSchedule>) {
  const now = new Date();
  const due: { lessonId: string; nextReviewDate: string }[] = [];
  Object.values(schedules).forEach((s) => {
    if (!s?.nextReviewDate) return;
    const next = new Date(s.nextReviewDate);
    if (next <= now) {
      due.push({ lessonId: s.lessonId, nextReviewDate: s.nextReviewDate });
    }
  });
  return due;
}

/* ---------------------------
   Component
   --------------------------- */
export default function RoadmapPage() {
  const [selected, setSelected] = useState<Roadmap | null>(null);
  const [playing, setPlaying] = useState<{ lessonId: string; title: string } | null>(null);
  const [groupProgress, setGroupProgress] = useState<Record<string, number>>({}); // roadmapId -> percent
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentLessonForQuiz, setCurrentLessonForQuiz] = useState<string | null>(null);
  const [lastQuizResult, setLastQuizResult] = useState<{ lessonId: string; score: number; message: string } | null>(null);

  // schedules: lessonId -> LessonSchedule
  const [schedules, setSchedules] = useState<Record<string, LessonSchedule>>(() => {
    try {
      return JSON.parse(localStorage.getItem("lessonSchedules") || "{}");
    } catch {
      return {};
    }
  });

  // UI control for notifications widget
  const [showDueList, setShowDueList] = useState(false);
  const dueLessons = getDueLessons(schedules);

  // refs to scroll to lesson when clicking a due item (simple focus)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // mock progress load
    setGroupProgress({ tech: 30, govt: 12 });
  }, []);

  useEffect(() => {
    // persist schedules whenever changed
    try {
      localStorage.setItem("lessonSchedules", JSON.stringify(schedules));
    } catch (err) {
      console.warn("Failed to persist lessonSchedules", err);
    }
  }, [schedules]);

  const startLesson = (roadmapId: string, lesson: { id: string; title: string }) => {
    setPlaying({ lessonId: lesson.id, title: lesson.title });
    // mark progress locally (for demo)
    setGroupProgress((p) => {
      const cur = p[roadmapId] ?? 0;
      const next = Math.min(
        100,
        cur + Math.round(100 / (mockRoadmaps.find((r) => r.id === roadmapId)?.lessons.length || 4))
      );
      return { ...p, [roadmapId]: next };
    });
  };

  const openQuizForLesson = (lessonId: string) => {
    setCurrentLessonForQuiz(lessonId);
    setQuizOpen(true);
  };

  const handleQuizComplete = (scorePercent: number) => {
    if (!currentLessonForQuiz) return;

    // Update schedule using SM-2 inspired function
    const prevSchedule = schedules[currentLessonForQuiz] || null;
    const updatedSchedule = updateSchedule(prevSchedule, scorePercent, currentLessonForQuiz);

    setSchedules((prev) => {
      const next = { ...prev, [currentLessonForQuiz]: updatedSchedule };
      return next;
    });

    setLastQuizResult({
      lessonId: currentLessonForQuiz,
      score: scorePercent,
      message: scorePercent >= 60 ? "Good — proceed to next lesson" : "Low score — schedule group review before proceeding",
    });

    // close quiz modal
    setQuizOpen(false);
    setCurrentLessonForQuiz(null);
  };

  // REVIEW NOW: simulate a solid group review (score 100) and update schedule
  const handleReviewNow = (lessonId: string) => {
    const prev = schedules[lessonId] || null;
    const updated = updateSchedule(prev, 100, lessonId); // treat as perfect review
    setSchedules((prevS) => ({ ...prevS, [lessonId]: updated }));
    // also show lastQuizResult briefly to confirm
    setLastQuizResult({ lessonId, score: 100, message: "Marked reviewed now" });
    setTimeout(() => setLastQuizResult(null), 2200);
  };

  const formatNextReview = (lessonId: string) => {
    const s = schedules[lessonId];
    if (!s || !s.nextReviewDate) return null;
    const d = new Date(s.nextReviewDate);
    return d.toLocaleDateString();
  };

  const handleClickDueItem = (lessonId: string) => {
    // find roadmap containing this lesson and open it
    for (const r of mockRoadmaps) {
      if (r.lessons.find((l) => l.id === lessonId)) {
        setSelected(r);
        // small timeout to ensure selected view rendered
        setTimeout(() => {
          const el = cardRefs.current[lessonId];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a quick highlight
            el.style.transition = "box-shadow 0.3s, transform 0.15s";
            el.style.transform = "scale(1.01)";
            setTimeout(() => {
              el.style.transform = "";
            }, 300);
          }
        }, 120);
        break;
      }
    }
    setShowDueList(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ position: "relative" }}>
        <div>
          <div className={styles.title}>Learn — Roadmaps</div>
          <div className={styles.subtitle}>Shared learning roadmaps for all students — videos, quizzes, and group reviews.</div>
        </div>

        {/* Due / Overdue notifications pill */}
        <div style={{ position: "absolute", right: 16, top: 16 }}>
          <button
            onClick={() => setShowDueList((s) => !s)}
            style={{
              background: dueLessons.length ? "#ef4444" : "#10b981",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 999,
              border: "none",
            }}
            title="Lessons due today / overdue"
          >
            {dueLessons.length > 0 ? `${dueLessons.length} due` : "All good"}
          </button>

          {showDueList && (
            <div style={{
              marginTop: 8,
              background: "#111827",
              padding: 8,
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              minWidth: 220,
            }}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>Due lessons</div>
              {dueLessons.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>No lessons due today</div>
              ) : (
                dueLessons.map((d) => (
                  <div key={d.lessonId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "6px 4px" }}>
                    <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>{d.lessonId}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleClickDueItem(d.lessonId)} className={styles.backBtn}>Open</button>
                      <button onClick={() => handleReviewNow(d.lessonId)} className={styles.startBtn}>Review Now</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {!selected ? (
        <div className={styles.grid}>
          {mockRoadmaps.map((r) => (
            <div
              key={r.id}
              className={styles.card}
              onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                (e.currentTarget as HTMLElement).style.setProperty("--x", `${x}%`);
                (e.currentTarget as HTMLElement).style.setProperty("--y", `${y}%`);
                (e.currentTarget as HTMLElement).style.setProperty("--x2", `${100 - x}%`);
                (e.currentTarget as HTMLElement).style.setProperty("--y2", `${100 - y}%`);
              }}
              onClick={() => setSelected(r)}
            >
              <div className={styles.ribbon}>Roadmap</div><br />
              <div className={styles.cardTitle}>{r.title}</div>
              <div className={styles.cardDesc}>{r.description}</div>

              <div className={styles.progressWrap}>
                <div className={styles.progressLabel}>Group Progress</div>
                <div className={styles.progress}>
                  <div
                    className={styles.progressInner}
                    style={{ width: `${groupProgress[r.id] ?? 0}%` }}
                  />
                </div>
              </div>

              <div className={styles.lessons} style={{ marginTop: 12 }}>
                {r.lessons.map((l, idx) => {
                  const nextIso = schedules[l.id]?.nextReviewDate ?? null;
                  const urgency = getUrgency(nextIso ?? null);
                  return (
                    <div
                      key={l.id}
                      className={styles.lesson}
                      onClick={(e) => {
                        e.stopPropagation();
                        startLesson(r.id, l);
                      }}
                      ref={(el) => (cardRefs.current[l.id] = el)}
                    >
                      <div>
                        <div className={styles.lessonTitle}>
                          {idx + 1}. {l.title}
                        </div>
                        <div className={styles.lessonMeta} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <div>{l.duration}</div>
                          <div>•</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                            Next review: {formatNextReview(l.id) ?? "Not scheduled"}
                          </div>

                          {/* urgency badge */}
                          <div className={`${styles.urgencyBadge} ${urgency.className}`} style={{ marginLeft: 8 }}>
                            {urgency.label}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className={styles.startBtn}
                          title="Start lesson"
                          onClick={(e) => {
                            e.stopPropagation();
                            startLesson(r.id, l);
                          }}
                        >
                          <Play size={14} style={{ marginRight: 6 }} /> Start
                        </button>

                        <button
                          className={styles.backBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuizForLesson(l.id);
                          }}
                          title="Start group quiz for this lesson"
                        >
                          <BookOpen size={14} style={{ marginRight: 6 }} /> Quiz
                        </button>

                        {/* Review Now quick action */}
                        <button
                          className={styles.startBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewNow(l.id);
                          }}
                          title="Mark this lesson as reviewed now (updates schedule)"
                          style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                        >
                          Review Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button className={styles.backBtn} onClick={() => setSelected(null)}>
            ← Back to Roadmaps
          </button>

          <div style={{ marginTop: 16 }} className={styles.viewer}>
            <div className={styles.videoCard}>
              <h3 style={{ fontWeight: 700 }}>{selected.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.75)" }}>{selected.description}</p>

              <div style={{ marginTop: 12 }}>
                {/* Mock video area */}
                <div
                  style={{
                    background: "black",
                    height: 320,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {playing ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>{playing.title}</div>
                      <div style={{ color: "rgba(255,255,255,0.7)" }}>Video player placeholder</div>
                    </div>
                  ) : (
                    <div style={{ color: "rgba(255,255,255,0.6)" }}>Select a lesson to start</div>
                  )}
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className={styles.startBtn}
                    onClick={() => {
                      /* local: mark complete */
                    }}
                  >
                    Mark Complete
                  </button>
                  <button className={styles.backBtn} onClick={() => setPlaying(null)}>
                    Close
                  </button>
                  <button
                    className={styles.startBtn}
                    onClick={() => {
                      if (playing) openQuizForLesson(playing.lessonId);
                      else alert("Start a lesson first to launch the quiz");
                    }}
                  >
                    Launch Group Quiz
                  </button>
                </div>

                {lastQuizResult && lastQuizResult.lessonId === (playing?.lessonId ?? currentLessonForQuiz) && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontWeight: 700 }}>Last Quiz Result: {lastQuizResult.score}%</div>
                    <div style={{ color: "rgba(255,255,255,0.75)" }}>{lastQuizResult.message}</div>
                  </div>
                )}
              </div>
            </div>

            <aside className={styles.sidePanel}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Lesson List</h4>
              <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Click a lesson to play in the viewer or run a quiz.</p>

              <div style={{ marginTop: 12 }}>
                {selected.lessons.map((l) => {
                  const nextIso = schedules[l.id]?.nextReviewDate ?? null;
                  const urgency = getUrgency(nextIso ?? null);
                  return (
                    <div key={l.id} className={styles.lessonItem}>
                      <div className={styles.lessonTop}>
                        <div>
                          <div className={styles.lessonTitle}>{l.title}</div>
                          <div className={styles.lessonMeta}>{l.duration} • Next review: {formatNextReview(l.id) ?? "Not scheduled"}</div>
                        </div>

                        <div className={`${styles.urgencyBadge} ${urgency.className}`}>{urgency.label}</div>
                      </div>

                      <div className={styles.lessonActions}>
                        <button className={styles.startBtn} onClick={() => startLesson(selected.id, l)}>Play</button>
                        <button className={styles.backBtn} onClick={() => openQuizForLesson(l.id)}>Quiz</button>
                        <button className={styles.reviewBtn} onClick={() => handleReviewNow(l.id)}>Review Now</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>Group Progress</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
                  {groupProgress[selected.id] ?? 0}% completed
                </div>
                <div style={{ marginTop: 8 }} className={styles.progress}>
                  <div className={styles.progressInner} style={{ width: `${groupProgress[selected.id] ?? 0}%` }} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Quiz modal */}
      <QuizModal
        open={quizOpen}
        onClose={() => { setQuizOpen(false); setCurrentLessonForQuiz(null); }}
        questions={currentLessonForQuiz ? (sampleMCQs[currentLessonForQuiz] ?? sampleMCQs["html"]) : []}
        onComplete={(scorePercent) => {
          handleQuizComplete(scorePercent);
        }}
      />
    </div>
  );
}
