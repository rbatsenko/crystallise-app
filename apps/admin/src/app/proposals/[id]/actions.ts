"use server";

import { revalidatePath } from "next/cache";
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
