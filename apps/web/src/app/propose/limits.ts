// Shared between the propose page (client) and /api/propose (server) so
// the two can't drift apart. Vercel rejects request bodies larger than
// ~4.5 MB before our route handler runs, so the client must stay safely
// under that ceiling — multipart boundaries and headers add overhead, so
// we leave ~1 MB of headroom.

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_BYTES = 3.5 * 1024 * 1024;
export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_MIME_SET: ReadonlySet<string> = new Set(ALLOWED_MIME);
