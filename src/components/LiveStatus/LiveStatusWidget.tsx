import { motion } from "framer-motion";
import { useLanyardStatus } from "@/lib/hooks/useLanyardStatus";
import { SpotifyStatus } from "./SpotifyStatus";
import { VSCodeStatus } from "./VSCodeStatus";
import { StatusSkeleton } from "./StatusSkeleton";

interface LiveStatusWidgetProps {
  discordUserId: string;
}

export function LiveStatusWidget({ discordUserId }: LiveStatusWidgetProps) {
  const { data, loading, error, refetch } = useLanyardStatus(discordUserId);

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center items-end gap-2">
        <StatusSkeleton />
        <StatusSkeleton />
      </div>
    );
  }

  if (error) {
    const isNotMonitored = error.message.includes("discord.gg/lanyard");
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primaryBlueDark/10 backdrop-blur-sm border border-white/5 rounded-full">
        <p className="text-sm text-white/60">
          {isNotMonitored ? (
            <>
              Join{" "}
              <a
                href="https://discord.gg/lanyard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primaryBlue hover:text-primaryBlueLight underline"
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
            onClick={() => refetch()}
            className="text-sm text-primaryBlue hover:text-primaryBlueLight transition-colors underline"
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap justify-center items-end gap-2"
    >
      <SpotifyStatus
        spotify={data.spotify}
        isListening={data.listening_to_spotify}
      />
      <VSCodeStatus activities={data.activities} />
    </motion.div>
  );
}
