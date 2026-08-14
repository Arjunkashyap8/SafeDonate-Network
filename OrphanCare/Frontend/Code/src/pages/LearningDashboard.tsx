// src/pages/LearningDashboard.tsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import styles from "../styles/RoadmapPage.module.css";

type RoadmapStat = { id: string; title: string; completedPercent: number };
type QuizRecord = { date: string; lessonId: string; score: number };

const mockRoadmaps: RoadmapStat[] = [
  { id: "tech", title: "Web Development", completedPercent: 45 },
  { id: "govt", title: "Govt Exam Prep", completedPercent: 18 },
  { id: "ds", title: "Data Basics", completedPercent: 5 },
];

const mockQuizHistory: QuizRecord[] = [
  { date: "2025-09-10", lessonId: "html", score: 70 },
  { date: "2025-09-17", lessonId: "css", score: 62 },
  { date: "2025-09-23", lessonId: "js", score: 55 },
  { date: "2025-09-30", lessonId: "react", score: 78 },
  { date: "2025-10-01", lessonId: "html", score: 82 },
];

export default function LearningDashboard() {
  const roadmapData = useMemo(() => mockRoadmaps, []);
  const quizData = useMemo(() => mockQuizHistory.map(q => ({ ...q, dateLabel: new Date(q.date).toLocaleDateString() })), []);

  return (
    <div className={styles.page} style={{ paddingTop: 24 }}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Learning — Progress Dashboard</div>
          <div className={styles.subtitle}>Group completion and recent quiz performance</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div className={styles.card} style={{ minHeight: 300 }}>
          <h3 style={{ margin: 0, marginBottom: 12, fontWeight: 700 }}>Roadmap Completion</h3>
          <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 6 }}>Overall completion % for each roadmap</p>

          <div style={{ height: 220, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roadmapData}
                layout="vertical"
                margin={{ top: 8, right: 12, bottom: 8, left: 12 }}
              >
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="title" width={140} />
                <Tooltip formatter={(v: any) => `${v}%`} />
                <Bar dataKey="completedPercent" barSize={18}>
                  {roadmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completedPercent >= 60 ? "#10b981" : (entry.completedPercent >= 30 ? "#60a5fa" : "#f59e0b")} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card} style={{ minHeight: 300 }}>
          <h3 style={{ margin: 0, marginBottom: 12, fontWeight: 700 }}>Quiz Score Trend</h3>
          <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 6 }}>Group quiz average (%) over recent sessions</p>

          <div style={{ height: 260, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizData} margin={{ top: 8, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="dateLabel" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.8)" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower area: summary cards */}
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <div className={styles.card} style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Overall Completion</div>
          <div style={{ marginTop: 8, fontSize: 20 }}>{Math.round(roadmapData.reduce((a,b)=>a+b.completedPercent,0) / roadmapData.length)}%</div>
          <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 10 }}>Average across all roadmaps</div>
        </div>

        <div className={styles.card} style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Recent Average Quiz</div>
          <div style={{ marginTop: 8, fontSize: 20 }}>{Math.round(quizData.reduce((a,b)=>a+b.score,0) / quizData.length)}%</div>
          <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 10 }}>Average of last {quizData.length} sessions</div>
        </div>
      </div>
    </div>
  );
}
