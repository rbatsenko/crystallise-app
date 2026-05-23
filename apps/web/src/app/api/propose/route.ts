import { after, NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@crystallise/supabase/admin";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const CHAR_LIMITS = {
  overview: 2000,
  deliverables: 1000,
  budget: 500,
  budget_breakdown: 2000,
  additional: 1000,
} as const;

const BUCKET = "proposal-images";
const ADMIN_URL = "https://crystallise-admin.vercel.app";

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  // Honeypot: real users never see this field. If it's filled, silently
  // pretend the submission went through so the bot moves on.
  if (str(form.get("website"))) {
    return NextResponse.json({ id: crypto.randomUUID() }, { status: 201 });
  }

  const name = str(form.get("name"));
  const email = str(form.get("email"));
  const overview = str(form.get("overview"));
  const deliverables = str(form.get("deliverables"));
  const budget = str(form.get("budget"));
  const budget_breakdown = str(form.get("budgetBreakdown"));
  const additional = str(form.get("additional"));

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
  if (budget_breakdown && budget_breakdown.length > CHAR_LIMITS.budget_breakdown) {
    return NextResponse.json(
      { error: "budget_breakdown_too_long" },
      { status: 400 },
    );
  }
  if (additional && additional.length > CHAR_LIMITS.additional) {
    return NextResponse.json({ error: "additional_too_long" }, { status: 400 });
  }

  const files = form
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: "invalid_file_type" },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }
  }

  const proposalId = crypto.randomUUID();
  const supabase = createAdminClient();

  const imagePaths: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = extFromMime(file.type);
    const path = `${proposalId}/${i}${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      await cleanup(supabase, imagePaths);
      console.error("[propose] upload failed", error);
      return NextResponse.json({ error: "upload_failed" }, { status: 500 });
    }
    imagePaths.push(path);
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

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return "";
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
      text: { type: "mrkdwn", text: `*Deliverables*\n${proposal.deliverables}` },
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
