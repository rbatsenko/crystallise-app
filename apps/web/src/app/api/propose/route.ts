import { after, NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@crystallise/supabase/admin";
import {
  ALLOWED_MIME_SET,
  BUCKET,
  MAX_FILE_BYTES,
  MAX_FILES,
} from "@/app/propose/limits";

const CHAR_LIMITS = {
  overview: 2000,
  deliverables: 1000,
  budget: 500,
  budget_breakdown: 2000,
  additional: 1000,
} as const;

const ADMIN_URL = "https://crystallise-admin.vercel.app";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  // Honeypot: real users never see this field. If it's filled, silently
  // pretend the submission went through so the bot moves on.
  if (str(body.website)) {
    return NextResponse.json({ id: crypto.randomUUID() }, { status: 201 });
  }

  const proposalId = str(body.proposalId);
  const name = str(body.name);
  const email = str(body.email);
  const overview = str(body.overview);
  const deliverables = str(body.deliverables);
  const budget = str(body.budget);
  const budget_breakdown = str(body.budgetBreakdown);
  const additional = str(body.additional);

  if (!UUID_RE.test(proposalId)) {
    return NextResponse.json({ error: "invalid_proposal_id" }, { status: 400 });
  }
  if (!name || !email || !overview) {
    return NextResponse.json(
      { error: "missing_required_fields" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (overview.length > CHAR_LIMITS.overview) {
    return NextResponse.json({ error: "overview_too_long" }, { status: 400 });
  }
  if (deliverables && deliverables.length > CHAR_LIMITS.deliverables) {
    return NextResponse.json(
      { error: "deliverables_too_long" },
      { status: 400 },
    );
  }
  if (budget && budget.length > CHAR_LIMITS.budget) {
    return NextResponse.json({ error: "budget_too_long" }, { status: 400 });
  }
  if (
    budget_breakdown &&
    budget_breakdown.length > CHAR_LIMITS.budget_breakdown
  ) {
    return NextResponse.json(
      { error: "budget_breakdown_too_long" },
      { status: 400 },
    );
  }
  if (additional && additional.length > CHAR_LIMITS.additional) {
    return NextResponse.json({ error: "additional_too_long" }, { status: 400 });
  }

  const imagePaths = Array.isArray(body.imagePaths)
    ? body.imagePaths.filter((p): p is string => typeof p === "string")
    : [];
  if (imagePaths.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  }
  // Every claimed path must live inside this submission's proposalId
  // folder. Stops a caller from attaching another proposal's images.
  for (const path of imagePaths) {
    if (!path.startsWith(`${proposalId}/`) || path.includes("..")) {
      return NextResponse.json(
        { error: "invalid_image_path" },
        { status: 400 },
      );
    }
  }

  const supabase = createAdminClient();

  // Verify each uploaded object exists and matches our size/mime limits.
  // Signed-URL uploads bypass our route handler entirely, so this is the
  // first chance the server has to inspect what actually landed.
  for (const path of imagePaths) {
    const { data: info, error } = await supabase.storage
      .from(BUCKET)
      .info(path);
    if (error || !info) {
      console.error("[propose] info failed", { path, error });
      await cleanup(supabase, imagePaths);
      return NextResponse.json(
        { error: "upload_not_found" },
        { status: 400 },
      );
    }
    const size = typeof info.size === "number" ? info.size : 0;
    const contentType =
      (info as { contentType?: string }).contentType ??
      (info as { content_type?: string }).content_type ??
      "";
    if (!ALLOWED_MIME_SET.has(contentType)) {
      await cleanup(supabase, imagePaths);
      return NextResponse.json(
        { error: "invalid_file_type" },
        { status: 400 },
      );
    }
    if (size > MAX_FILE_BYTES) {
      await cleanup(supabase, imagePaths);
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }
  }

  const { error: insertError } = await supabase.from("proposals").insert({
    id: proposalId,
    name,
    email,
    overview,
    deliverables: deliverables || null,
    budget: budget || null,
    budget_breakdown: budget_breakdown || null,
    additional: additional || null,
    image_paths: imagePaths,
  });

  if (insertError) {
    await cleanup(supabase, imagePaths);
    console.error("[propose] insert failed", insertError);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  // Post the Slack notification after the response is sent. `after()` keeps
  // the serverless function alive until the callback resolves; without it the
  // function froze on Vercel mid-write to hooks.slack.com (ETIMEDOUT).
  after(async () => {
    try {
      await notifySlack({
        id: proposalId,
        name,
        email,
        overview,
        deliverables,
        budget,
        budget_breakdown,
        additional,
        imageCount: imagePaths.length,
      });
    } catch (err) {
      console.error("[propose] slack notify failed", err);
    }
  });

  return NextResponse.json({ id: proposalId }, { status: 201 });
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function cleanup(
  supabase: ReturnType<typeof createAdminClient>,
  paths: string[],
) {
  if (paths.length === 0) return;
  await supabase.storage.from(BUCKET).remove(paths);
}

async function notifySlack(proposal: {
  id: string;
  name: string;
  email: string;
  overview: string;
  deliverables: string;
  budget: string;
  budget_breakdown: string;
  additional: string;
  imageCount: number;
}) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  type Block =
    | { type: "header"; text: { type: "plain_text"; text: string } }
    | { type: "divider" }
    | { type: "section"; text: { type: "mrkdwn"; text: string } }
    | { type: "context"; elements: { type: "mrkdwn"; text: string }[] };

  const blocks: Block[] = [
    { type: "divider" },
    {
      type: "header",
      text: { type: "plain_text", text: "✨ New proposal" },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*From*\n${proposal.name}` },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Email*\n<mailto:${proposal.email}|${proposal.email}>`,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Overview*\n${proposal.overview}` },
    },
  ];

  if (proposal.deliverables) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Deliverables*\n${proposal.deliverables}`,
      },
    });
  }

  if (proposal.budget) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Budget*\n${proposal.budget}` },
    });
  }

  if (proposal.budget_breakdown) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Breakdown*\n${proposal.budget_breakdown}`,
      },
    });
  }

  if (proposal.additional) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Additional*\n${proposal.additional}` },
    });
  }

  const imageLabel =
    proposal.imageCount > 0
      ? `🖼️ ${proposal.imageCount} image${proposal.imageCount === 1 ? "" : "s"}`
      : "No images";
  const adminLink = `<${ADMIN_URL}/proposals/${proposal.id}|Open in admin ↗>`;
  blocks.push({ type: "divider" });
  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `${imageLabel} · ${adminLink}` }],
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New proposal from ${proposal.name}`,
      blocks,
    }),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook ${res.status}: ${await res.text()}`);
  }
}
