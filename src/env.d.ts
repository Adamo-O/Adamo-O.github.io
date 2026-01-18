/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_DISCORD_USER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
