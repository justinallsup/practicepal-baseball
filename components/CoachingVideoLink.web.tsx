import React from "react";
import { C, F } from "./ui";

export default function CoachingVideoLink({ url, provider, kind }: { url: string; provider: string; kind: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${kind === "video" ? "Watch" : "Read"} on ${provider} (opens a new tab)`}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, minHeight: 52, boxSizing: "border-box", padding: "14px 18px",
        background: C.lime, color: C.navy, borderRadius: 12,
        fontFamily: F, fontWeight: 800, fontSize: 14, textDecoration: "none",
      }}
    >
      <span>{kind === "video" ? "Watch" : "Read"} on {provider}</span><span aria-hidden="true">↗</span>
    </a>
  );
}
