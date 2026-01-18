import { useState, useEffect, useCallback } from "react";
import type { LanyardData, LanyardResponse } from "@/components/LiveStatus/types";

const LANYARD_API_URL = "https://api.lanyard.rest/v1/users";
const POLL_INTERVAL = 30000; // 30 seconds

interface UseLanyardStatusReturn {
  data: LanyardData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLanyardStatus(userId: string): UseLanyardStatusReturn {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!userId) {
      setError(new Error("Discord User ID is required"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${LANYARD_API_URL}/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.statusText}`);
      }

      const json: LanyardResponse = await response.json();

      if (!json.success) {
        if (json.error.code === "user_not_monitored") {
          throw new Error("Join discord.gg/lanyard to enable status");
        }
        throw new Error(json.error.message || "Lanyard API error");
      }

      setData(json.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
}
