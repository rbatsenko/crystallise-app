"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@crystallise/supabase/server";
import type { Database } from "@crystallise/supabase/types";

type Status = Database["public"]["Enums"]["proposal_status"];

const VALID_STATUSES: Status[] = ["new", "reviewing", "accepted", "declined"];

export async function updateStatus(id: string, status: Status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("proposals")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  revalidatePath(`/proposals/${id}`);
  revalidatePath("/proposals");
}

export async function updateNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("proposals")
    .update({ admin_notes: notes })
    .eq("id", id);
  if (error) throw error;
  revalidatePath(`/proposals/${id}`);
}

export async function setArchived(id: string, archived: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("proposals")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
  revalidatePath(`/proposals/${id}`);
  revalidatePath("/proposals");
}

export async function deleteProposal(id: string) {
  const supabase = await createClient();

  // Look up image paths before deletion so we can clean up storage after.
  const { data: row, error: fetchError } = await supabase
    .from("proposals")
    .select("image_paths")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw fetchError;

  const { error: deleteError } = await supabase
    .from("proposals")
    .delete()
    .eq("id", id);
  if (deleteError) throw deleteError;

  // Best-effort: orphaned objects are harmless and can be swept later.
  const paths = row?.image_paths ?? [];
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("proposal-images")
      .remove(paths);
    if (storageError) {
      console.error("[proposals] storage cleanup failed", {
        id,
        error: storageError,
      });
    }
  }

  revalidatePath("/proposals");
  redirect("/proposals");
}
