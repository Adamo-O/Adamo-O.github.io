import { LazyMotion, domAnimation, m } from "framer-motion";
import { useLanyardStatus } from "@/lib/hooks/useLanyardStatus";
import { SpotifyStatus } from "./SpotifyStatus";
import { VSCodeStatus } from "./VSCodeStatus";
import { StatusSkeleton } from "./StatusSkeleton";

interface LiveStatusWidgetProps {
  discordUserId: string;
  /** Horizontal alignment of the pill row. Default "center". */
  align?: "start" | "center";
}

const PILL =
  "flex items-center justify-center gap-2 rounded-pill border border-line bg-surface px-4 py-2 shadow-card";

export function LiveStatusWidget({ discordUserId, align = "center" }: LiveStatusWidgetProps) {
  const { data, loading, error, refetch } = useLanyardStatus(discordUserId);
  const row = `flex flex-wrap items-end gap-2 ${align === "start" ? "justify-start" : "justify-center"}`;

  if (loading) {
    return (
      <div className={row}>
        <StatusSkeleton />
        <StatusSkeleton />
      </div>
    );
  }

  if (error) {
    const isNotMonitored = error.message.includes("discord.gg/lanyard");
    return (
      <div className={PILL}>
        <p className="text-sm text-muted">
          {isNotMonitored ? (
            <>
              Join{" "}
              <a
                href="https://discord.gg/lanyard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline transition-colors hover:text-accent-strong"
              >
                discord.gg/lanyard
              </a>{" "}
              to enable status
            </>
          ) : (
            "Unable to load status"
          )}
        </p>
        {!isNotMonitored && (
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm text-accent underline transition-colors hover:text-accent-strong"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={row}
      >
        <SpotifyStatus spotify={data.spotify} isListening={data.listening_to_spotify} />
        <VSCodeStatus activities={data.activities} />
      </m.div>
    </LazyMotion>
  );
}
