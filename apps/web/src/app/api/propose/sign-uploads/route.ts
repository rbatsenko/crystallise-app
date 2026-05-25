import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@crystallise/supabase/admin";
import {
  ALLOWED_MIME_SET,
  BUCKET,
  EXT_BY_MIME,
  MAX_FILE_BYTES,
  MAX_FILES,
} from "@/app/propose/limits";

type FileMeta = { type?: unknown; size?: unknown };

export async function POST(request: NextRequest) {
  let body: { files?: FileMeta[] };
  try {
    body = (await request.json()) as { files?: FileMeta[] };
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const files = Array.isArray(body.files) ? body.files : [];
  if (files.length === 0) {
    return NextResponse.json({ error: "no_files" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  }
  for (const f of files) {
    if (typeof f?.type !== "string" || !ALLOWED_MIME_SET.has(f.type)) {
      return NextResponse.json({ error: "invalid_file_type" }, { status: 400 });
    }
    if (typeof f.size !== "number" || f.size <= 0 || f.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }
  }

  const supabase = createAdminClient();
  const proposalId = crypto.randomUUID();
  const uploads: Array<{
    path: string;
    token: string;
    signedUrl: string;
    contentType: string;
  }> = [];

  for (let i = 0; i < files.length; i++) {
    const contentType = files[i].type as string;
    const ext = EXT_BY_MIME[contentType];
    const path = `${proposalId}/${i}.${ext}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);
    if (error || !data) {
      console.error("[propose] createSignedUploadUrl failed", error);
      return NextResponse.json({ error: "sign_failed" }, { status: 500 });
    }
    uploads.push({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      contentType,
    });
  }

  return NextResponse.json({ proposalId, uploads }, { status: 200 });
}
