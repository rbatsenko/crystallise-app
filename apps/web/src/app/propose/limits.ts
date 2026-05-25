// Shared between the propose page (client), /api/propose/sign-uploads, and
// /api/propose so the three can't drift apart. Images now go direct to
// Supabase Storage via signed upload URLs, so we don't have to dance
// around Vercel's ~4.5 MB request body limit anymore — only the metadata
// POST goes through our API.

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_MIME_SET: ReadonlySet<string> = new Set(ALLOWED_MIME);
export const BUCKET = "proposal-images";

export const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
