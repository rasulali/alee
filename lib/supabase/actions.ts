"use server";

import type { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./server";

type RefreshSessionResult =
  | { status: "ok"; user: User | null }
  | { status: "error"; message: string };

export type SignOutState =
  | { status: "idle"; message?: string }
  | { status: "error"; message: string };

export async function refreshSessionAction(): Promise<RefreshSessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "ok", user };
}

export async function signOutAction(
  _prevState: SignOutState,
  formData: FormData,
): Promise<SignOutState> {
  const redirectTo =
    (formData.get("redirectTo") as string | null) ?? "/login";

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { status: "error", message: error.message };
  }

  // Ensure downstream routes see the cleared session.
  revalidatePath("/", "layout");
  redirect(redirectTo);
  return { status: "idle" };
}
