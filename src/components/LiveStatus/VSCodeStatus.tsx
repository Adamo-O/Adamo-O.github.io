import { useState, useEffect } from "react";
import { m, useReducedMotion } from "framer-motion";
import type { LanyardActivity } from "./types";

const PILL =
  "relative flex h-12 items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 shadow-card sm:h-[52px] sm:gap-2.5 sm:px-4 sm:py-2";

function SleepingZzz() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute -right-3 -top-1 h-5 w-6">
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="absolute font-bold text-muted/60"
          style={{
            left: `${i * 6}px`,
            fontSize: `${8 + i * 2}px`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.6, 0.6, 0], y: -12 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        >
          z
        </m.span>
      ))}
    </div>
  );
}

const typewriterWords = ["coding ⌨️", "working 💪", "developing 🧑‍💻", "researching 🔬"];

// Splits string into grapheme clusters (handles emojis correctly)
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const toGraphemes = (str: string) => [...segmenter.segment(str)].map((s) => s.segment);

function TypewriterLabel() {
  const shouldReduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(typewriterWords[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setText(typewriterWords[0]);
      return;
    }

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          const graphemes = toGraphemes(text);
          if (graphemes.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % typewriterWords.length);
          } else {
            setText(graphemes.slice(0, -1).join(""));
          }
        } else {
          const targetWord = typewriterWords[wordIndex];
          if (text === targetWord) {
            setIsPaused(true);
          } else {
            const targetGraphemes = toGraphemes(targetWord);
            const currentLength = toGraphemes(text).length;
            setText(targetGraphemes.slice(0, currentLength + 1).join(""));
          }
        }
      },
      isDeleting ? 80 : 120
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, isPaused, shouldReduceMotion]);

  return (
    <span className="text-sm text-muted">
      Now {text}
      {!shouldReduceMotion && (
        <m.span
          className="ml-[1px] inline-block"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          |
        </m.span>
      )}
    </span>
  );
}

interface VSCodeStatusProps {
  activities: LanyardActivity[];
}

function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

function getAssetUrl(applicationId: string, assetId: string): string {
  return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
}

export function VSCodeStatus({ activities }: VSCodeStatusProps) {
  const vscodeActivity = activities.find(
    (activity) =>
      activity.name.toLowerCase().includes("visual studio code") ||
      activity.name.toLowerCase().includes("vscode") ||
      activity.name.toLowerCase() === "code"
  );

  if (!vscodeActivity) {
    return (
      <div className={PILL}>
        <VSCodeIcon className="h-4 w-4 text-muted sm:h-5 sm:w-5" />
        <span className="text-sm text-muted sm:text-base">Not coding</span>
        <SleepingZzz />
      </div>
    );
  }

  // Extract just the text without emoji prefix
  const filename = vscodeActivity.details?.replace(/^[^\w]*/, "") || "Coding";
  const workspace = vscodeActivity.state?.replace(/^[^\w]*/, "") || "";

  // Get file icon from Discord assets
  const fileIconUrl =
    vscodeActivity.application_id && vscodeActivity.assets?.large_image
      ? getAssetUrl(vscodeActivity.application_id, vscodeActivity.assets.large_image)
      : null;

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${PILL} pl-3.5`}
    >
      {fileIconUrl ? (
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-sm bg-[#1e1e1e] sm:h-8 sm:w-8">
          <img
            src={fileIconUrl}
            alt=""
            className="h-8 w-8 scale-150 object-contain sm:h-10 sm:w-10"
          />
        </div>
      ) : (
        <VSCodeIcon className="h-4 w-4 text-[#007ACC] sm:h-5 sm:w-5" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5">
        <span className="max-w-[200px] truncate text-sm text-fg sm:text-base">
          {filename}
        </span>
        {workspace && (
          <span className="max-w-[150px] truncate text-xs text-muted sm:max-w-[180px] sm:text-base">
            {workspace}
          </span>
        )}
      </div>
    </m.div>
  );
}
