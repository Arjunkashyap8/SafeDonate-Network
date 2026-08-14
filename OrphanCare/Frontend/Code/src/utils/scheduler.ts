// src/utils/scheduler.ts
export type LessonSchedule = {
  lessonId: string;
  EF: number;            // ease factor
  interval: number;      // days until next review
  repetitions: number;   // number of successful repetitions
  nextReviewDate: string; // ISO string
};

/**
 * Map a scorePercent 0..100 -> q (0..5)
 * We'll use Math.round(scorePercent / 20)
 */
function scoreToQ(scorePercent: number): number {
  const q = Math.round(scorePercent / 20);
  // clamp 0..5
  return Math.max(0, Math.min(5, q));
}

/**
 * updateSchedule: apply SM-2 style algorithm for group
 */
export function updateSchedule(
  schedule: LessonSchedule | null,
  scorePercent: number,
  lessonId: string
): LessonSchedule {
  const q = scoreToQ(scorePercent);
  const today = new Date();

  // initialize if missing
  if (!schedule) {
    schedule = {
      lessonId,
      EF: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewDate: today.toISOString(),
    };
  }

  let { EF, interval, repetitions } = schedule;

  if (q < 3) {
    // failed quality — reset repetitions and schedule soon
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * EF);

    // update EF
    EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (EF < 1.3) EF = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(today.getDate() + interval);

  return {
    lessonId,
    EF,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}
