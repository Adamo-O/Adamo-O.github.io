import { motion, useReducedMotion } from "framer-motion";
import type { LanyardSpotify } from "./types";

function SleepingZzz() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="absolute -top-1 -right-3 w-6 h-5 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute text-white/40 font-bold"
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
        </motion.span>
      ))}
    </div>
  );
}

function MusicNotes() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="absolute -top-2 -right-1 w-4 h-5 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute text-[#1DB954] text-[10px] font-bold"
          style={{ left: `${i * 4}px` }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -16 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        >
          ♪
        </motion.span>
      ))}
    </div>
  );
}

interface SpotifyStatusProps {
  spotify: LanyardSpotify | null;
  isListening: boolean;
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function SpotifyStatus({ spotify, isListening }: SpotifyStatusProps) {
  if (!isListening || !spotify) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primaryBlueDark/10 backdrop-blur-sm border border-white/5 rounded-full h-10 sm:h-[52px]">
          <SpotifyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
          <span className="text-sm sm:text-base text-white/40">Not listening</span>
          <SleepingZzz />
        </div>
      </div>
    );
  }

  const trackUrl = `https://open.spotify.com/track/${spotify.track_id}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="relative text-sm text-white/50">
        Now listening 🎧
        <MusicNotes />
      </span>
      <motion.a
        href={trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-primaryBlueDark/10 backdrop-blur-sm border border-white/5 rounded-full transition-colors hover:bg-primaryBlueDark/20 h-auto sm:h-[52px]"
      >
        <img
          src={spotify.album_art_url}
          alt={spotify.album}
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-md object-cover"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5">
          <span className="text-sm sm:text-base text-white group-hover:text-[#1DB954] transition-colors max-w-[150px] truncate">
            {spotify.song}
          </span>
          <span className="text-xs sm:text-base text-white/50 max-w-[150px] sm:max-w-[100px] truncate">
            {spotify.artist}
          </span>
        </div>
      </motion.a>
    </div>
  );
}
