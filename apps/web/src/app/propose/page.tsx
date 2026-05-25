"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { createClient as createSupabaseBrowser } from "@crystallise/supabase/browser";
import { compressImage } from "./compressImage";
import ExpandableTextarea from "./ExpandableTextarea";
import { ALLOWED_MIME, BUCKET, MAX_FILE_BYTES } from "./limits";

// Compress any image larger than this before uploading. Picks up phone
// photos (typically 4-15 MB) while leaving already-small files alone.
const COMPRESS_THRESHOLD_BYTES = 1024 * 1024;

const inputClasses =
  "w-full bg-cream border border-stone/40 rounded-none px-4 py-3 font-[family-name:var(--font-body)] text-charcoal text-sm focus:outline-none focus:border-gold transition-colors";

const labelClasses =
  "block font-[family-name:var(--font-display)] text-sm text-charcoal mb-2";

const CHAR_LIMITS = {
  overview: 2000,
  deliverables: 1000,
  budget: 500,
  budgetBreakdown: 2000,
  additional: 1000,
};

type LongFieldKey =
  | "overview"
  | "deliverables"
  | "budget"
  | "budgetBreakdown"
  | "additional";

const EMPTY_LONG_FIELDS: Record<LongFieldKey, string> = {
  overview: "",
  deliverables: "",
  budget: "",
  budgetBreakdown: "",
  additional: "",
};

type SubmitState =
  | "idle"
  | "compressing"
  | "uploading"
  | "submitting"
  | "success"
  | "error";

const ERROR_MESSAGES: Record<string, string> = {
  missing_required_fields: "Name, email, and overview are required.",
  invalid_email: "That email doesn't look right.",
  invalid_file_type: "Images must be JPEG, PNG, or WebP.",
  file_too_large: "Each image must be under 5MB.",
  too_many_files: "Maximum 5 images.",
  no_files: "Please attach at least one image, or skip the upload field.",
  overview_too_long: "Overview is too long.",
  deliverables_too_long: "Deliverables is too long.",
  budget_too_long: "Budget is too long.",
  budget_breakdown_too_long: "Budget breakdown is too long.",
  additional_too_long: "Additional info is too long.",
  sign_failed: "We couldn't prepare your upload. Try again?",
  upload_not_found:
    "Your images didn't finish uploading. Check your connection and try again.",
  invalid_proposal_id: "Something went wrong. Try refreshing the page.",
  invalid_image_path: "Something went wrong with the images. Try again?",
  insert_failed: "Something went wrong saving your proposal.",
  invalid_form: "We couldn't read the form data. Try again?",
};

const NETWORK_ERROR_MSG =
  "Network error - check your connection and try again.";
const GENERIC_ERROR_MSG = "Something went wrong. Try again?";
const UPLOAD_FAILED_MSG = "Image upload failed. Try again?";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export default function ProposePage() {
  const [fields, setFields] = useState<Record<LongFieldKey, string>>(
    EMPTY_LONG_FIELDS,
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setField = (key: LongFieldKey) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const originalFiles = formData
      .getAll("images")
      .filter((v): v is File => v instanceof File && v.size > 0);

    let processedFiles: File[] = originalFiles;
    if (originalFiles.some((f) => f.size > COMPRESS_THRESHOLD_BYTES)) {
      setSubmitState("compressing");
      processedFiles = await Promise.all(
        originalFiles.map((file) =>
          file.size > COMPRESS_THRESHOLD_BYTES
            ? compressImage(file).catch((err) => {
                console.error("[propose] compression failed", err);
                return file;
              })
            : file,
        ),
      );
    }

    // Per-file ceiling — total size is no longer a concern since each
    // image streams direct to Supabase, bypassing Vercel's body limit.
    const oversize = processedFiles.find((f) => f.size > MAX_FILE_BYTES);
    if (oversize) {
      setErrorMsg(ERROR_MESSAGES.file_too_large);
      setSubmitState("error");
      return;
    }
    if (!processedFiles.every((f) => ALLOWED_MIME.includes(
      f.type as (typeof ALLOWED_MIME)[number],
    ))) {
      setErrorMsg(ERROR_MESSAGES.invalid_file_type);
      setSubmitState("error");
      return;
    }

    const metadata = {
      name: str(formData.get("name")),
      email: str(formData.get("email")),
      overview: str(formData.get("overview")),
      deliverables: str(formData.get("deliverables")),
      budget: str(formData.get("budget")),
      budgetBreakdown: str(formData.get("budgetBreakdown")),
      additional: str(formData.get("additional")),
      website: str(formData.get("website")), // honeypot
    };

    let proposalId: string;
    let imagePaths: string[] = [];

    if (processedFiles.length > 0) {
      setSubmitState("uploading");
      let signResp: Response;
      try {
        signResp = await fetch("/api/propose/sign-uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: processedFiles.map((f) => ({
              type: f.type,
              size: f.size,
            })),
          }),
        });
      } catch {
        setErrorMsg(NETWORK_ERROR_MSG);
        setSubmitState("error");
        return;
      }
      if (!signResp.ok) {
        const payload = (await signResp.json().catch(() => ({}))) as {
          error?: string;
        };
        setErrorMsg(
          (payload.error && ERROR_MESSAGES[payload.error]) || GENERIC_ERROR_MSG,
        );
        setSubmitState("error");
        return;
      }
      const signed = (await signResp.json()) as {
        proposalId: string;
        uploads: Array<{ path: string; token: string; contentType: string }>;
      };
      proposalId = signed.proposalId;

      const supabase = createSupabaseBrowser();
      try {
        await Promise.all(
          signed.uploads.map(async ({ path, token, contentType }, i) => {
            const file = processedFiles[i];
            const { error } = await supabase.storage
              .from(BUCKET)
              .uploadToSignedUrl(path, token, file, {
                contentType: file.type || contentType,
              });
            if (error) throw error;
          }),
        );
      } catch (err) {
        console.error("[propose] direct upload failed", err);
        setErrorMsg(UPLOAD_FAILED_MSG);
        setSubmitState("error");
        return;
      }
      imagePaths = signed.uploads.map((u) => u.path);
    } else {
      proposalId = crypto.randomUUID();
    }

    setSubmitState("submitting");
    try {
      const res = await fetch("/api/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, imagePaths, ...metadata }),
      });
      if (res.ok) {
        setSubmitState("success");
        return;
      }
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      setErrorMsg(
        (payload.error && ERROR_MESSAGES[payload.error]) || GENERIC_ERROR_MSG,
      );
      setSubmitState("error");
    } catch {
      setErrorMsg(NETWORK_ERROR_MSG);
      setSubmitState("error");
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <div className="px-6 pt-6">
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors font-[family-name:var(--font-body)] text-sm bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block"
          >
            &larr; Back
          </Link>
        </div>

        <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
          <motion.div
            className="bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-6 mb-12 max-w-md mx-auto"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-white text-center mb-3">
              Pitch an Idea
            </h1>
            <p className="font-[family-name:var(--font-body)] text-white/80 text-center">
              Have a creative climbing project in mind? We want to hear about it.
            </p>
          </motion.div>

          {submitState === "success" ? (
            <motion.div
              className="torn-paper bg-warm-gray px-8 py-12 isolate text-center"
              style={{ transform: "rotate(-0.5deg)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-3">
                Thanks - we&apos;ve got it.
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-slate">
                We&apos;ll review your idea and get back to you at the email you
                provided.
              </p>
            </motion.div>
          ) : (
          <motion.form
            className="torn-paper bg-warm-gray px-8 py-10 space-y-6 isolate"
            style={{ transform: "rotate(-0.5deg)" }}
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClasses}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={inputClasses}
                placeholder="..."
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={inputClasses}
                placeholder="..."
              />
            </div>

            <ExpandableTextarea
              id="overview"
              name="overview"
              label="General Overview"
              rows={4}
              maxLength={CHAR_LIMITS.overview}
              placeholder="Describe your project idea - what is it, and why does it matter?"
              value={fields.overview}
              onChange={setField("overview")}
            />

            <ExpandableTextarea
              id="deliverables"
              name="deliverables"
              label="Deliverables"
              rows={3}
              maxLength={CHAR_LIMITS.deliverables}
              placeholder="What will the project produce? (e.g. a short film, a zine, a photo series...)"
              value={fields.deliverables}
              onChange={setField("deliverables")}
            />

            <ExpandableTextarea
              id="budget"
              name="budget"
              label="Required Budget"
              rows={2}
              maxLength={CHAR_LIMITS.budget}
              placeholder="How much funding do you need, roughly?"
              value={fields.budget}
              onChange={setField("budget")}
            />

            <ExpandableTextarea
              id="budgetBreakdown"
              name="budgetBreakdown"
              label="Budget Breakdown"
              rows={4}
              maxLength={CHAR_LIMITS.budgetBreakdown}
              placeholder="Break down how the budget would be spent (e.g. equipment hire, travel, editing...)"
              value={fields.budgetBreakdown}
              onChange={setField("budgetBreakdown")}
            />

            <ExpandableTextarea
              id="additional"
              name="additional"
              label="Additional Information"
              rows={3}
              maxLength={CHAR_LIMITS.additional}
              placeholder="Anything else you'd like us to know?"
              value={fields.additional}
              onChange={setField("additional")}
            />

            {/* Supporting Images */}
            <div>
              <label htmlFor="images" className={labelClasses}>
                Supporting Images
              </label>
              <p className="text-xs text-slate/60 mb-2 font-[family-name:var(--font-body)]">
                Upload any reference images, mood boards, or visuals that help
                convey your idea. Up to 5 images, 5MB each (JPEG, PNG, WebP).
                Large photos are automatically compressed before upload.
              </p>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept={ALLOWED_MIME.join(",")}
                className="w-full font-[family-name:var(--font-body)] text-sm text-slate file:mr-4 file:py-2 file:px-4 file:border file:border-stone/40 file:bg-cream/60 file:text-charcoal file:text-sm file:font-[family-name:var(--font-body)] file:cursor-pointer file:rounded-none hover:file:bg-cream transition-colors"
              />
            </div>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />

            <div className="space-y-3">
              <button
                type="submit"
                disabled={
                  submitState === "compressing" ||
                  submitState === "uploading" ||
                  submitState === "submitting"
                }
                className="torn-paper bg-gold px-8 py-3 font-[family-name:var(--font-display)] text-charcoal text-sm tracking-wide hover:bg-gold/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ transform: "rotate(0.5deg)" }}
              >
                {submitState === "compressing"
                  ? "Optimizing images…"
                  : submitState === "uploading"
                    ? "Uploading images…"
                    : submitState === "submitting"
                      ? "Sending…"
                      : "Submit Idea"}
              </button>
              {submitState === "error" && errorMsg && (
                <p className="font-[family-name:var(--font-body)] text-sm text-red-700">
                  {errorMsg}
                </p>
              )}
            </div>
          </motion.form>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
