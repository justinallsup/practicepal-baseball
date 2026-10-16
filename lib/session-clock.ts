import type { PracticeSession } from "./practice-types";
export function elapsedForSession(session: PracticeSession, now = Date.now()) {
  const end = session.pausedAt ? Date.parse(session.pausedAt) : now;
  const elapsed = session.startedAt
    ? (end - Date.parse(session.startedAt)) / 1000 -
      (session.pausedSeconds ?? 0)
    : 0;
  return Math.max(
    0,
    Math.min(session.durationMinutes * 60, Math.floor(elapsed)),
  );
}
