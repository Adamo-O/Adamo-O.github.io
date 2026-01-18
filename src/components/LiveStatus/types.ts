export interface LanyardSpotify {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  album: string;
  album_art_url: string;
  artist: string;
  song: string;
}

export interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
}

export interface LanyardData {
  spotify: LanyardSpotify | null;
  listening_to_spotify: boolean;
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
}

export interface LanyardSuccessResponse {
  success: true;
  data: LanyardData;
}

export interface LanyardErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type LanyardResponse = LanyardSuccessResponse | LanyardErrorResponse;
