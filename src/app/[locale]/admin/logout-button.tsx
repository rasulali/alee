"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { signOutAction, type SignOutState } from "@/lib/supabase/actions";

const initialState: SignOutState = { status: "idle" };

export default function LogoutButton() {
  const params = useParams();
  const locale = (params?.locale as string | undefined) ?? "en";

  const [state, logoutAction] = useActionState<SignOutState, FormData>(
    signOutAction,
    initialState,
  );

  return (
    <form action={logoutAction} className="inline-block">
      <input type="hidden" name="redirectTo" value={`/${locale}/login`} />
      <SubmitButton />
      {state.status === "error" && (
        <p className="mt-2 text-sm text-red-500" aria-live="polite">
          {state.message ?? "Failed to sign out. Please try again."}
        </p>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
