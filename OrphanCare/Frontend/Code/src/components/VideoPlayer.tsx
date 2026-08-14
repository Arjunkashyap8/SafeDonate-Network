import React, { useRef, useEffect, useState } from "react";

type VideoPlayerProps = {
  src: string;                  // video src (mp4 or HLS if using player)
  lessonId: string;
  roadmapId?: string;
  onWatchedPercent?: (percent: number) => void; // reported continuously
  onCompleted?: (lessonId: string) => void;     // when threshold reached
  threshold?: number;           // completion threshold (0-100), default 80
};

export default function VideoPlayer({
  src,
  lessonId,
  roadmapId,
  onWatchedPercent,
  onCompleted,
  threshold = 80,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // we'll track cumulative watched seconds using segments to avoid double-counting
  const [watchedSegments, setWatchedSegments] = useState<Array<[number,number]>>([]); // [start,end]
  const [lastTime, setLastTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(v.duration || 0);
    };

    const onTimeUpdate = () => {
      const t = v.currentTime;
      // Detect small seeks; record segment from lastTime -> t when playback is moving forward
      // We'll only append small segments and merge them later.
      setWatchedSegments(prev => {
        // If playback moved forward:
        if (t > lastTime + 0.3) {
          const newSeg: [number, number] = [Math.max(0, lastTime), t];
          const merged = mergeSegments([...prev, newSeg]);
          return merged;
        }
        return prev;
      });
      setLastTime(t);
      // compute percent covered
      const covered = computeCoveredSeconds(watchedSegments, duration);
      const percent = duration > 0 ? Math.round((covered / duration) * 100) : 0;
      if (onWatchedPercent) onWatchedPercent(percent);
      if (!completed && percent >= threshold) {
        setCompleted(true);
        if (onCompleted) onCompleted(lessonId);
        // optional: send POST to backend to mark completed (uncomment when ready)
        // fetch(`/api/orphanage/${roadmapId}/lessons/${lessonId}/complete`, { method: 'POST' })
      }
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, lastTime, duration, watchedSegments, completed, threshold]);

  // merge overlapping segments utility
  function mergeSegments(segs: Array<[number,number]>) {
    if (!segs.length) return [];
    const s = segs
      .map(([a,b]) => [Math.min(a,b), Math.max(a,b)])
      .sort((x,y) => x[0] - y[0]);
    const merged: Array<[number,number]> = [];
    let cur = s[0];
    for (let i = 1; i < s.length; i++) {
      const next = s[i];
      if (next[0] <= cur[1] + 0.5) { // small gap tolerance
        cur[1] = Math.max(cur[1], next[1]);
      } else {
        merged.push([cur[0], cur[1]]);
        cur = next;
      }
    }
    merged.push([cur[0], cur[1]]);
    return merged;
  }

  function computeCoveredSeconds(segs: Array<[number,number]>, dur: number) {
    if (!segs.length || !dur) return 0;
    // merge to be safe
    const merged = mergeSegments(segs);
    let sum = 0;
    for (const [a,b] of merged) {
      sum += Math.max(0, Math.min(b, dur) - Math.max(0, a));
    }
    return Math.min(sum, dur);
  }

  // show friendly percent to user (recompute from state)
  const coveredSec = computeCoveredSeconds(watchedSegments, duration);
  const percentCovered = duration > 0 ? Math.round((coveredSec / duration) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <video
        ref={videoRef}
        src={src}
        controls
        style={{ width: "100%", borderRadius: 8, background: "#000" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          Watched: <strong>{percentCovered}%</strong>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          {completed ? "Completed ✓" : `Complete ${threshold}% to mark`}
        </div>
      </div>
    </div>
  );
}
