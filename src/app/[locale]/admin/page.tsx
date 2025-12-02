import { Suspense, use } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const {
    data: { user },
    error,
  } = use(getUser());

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg opacity-60 mb-2">Email: {user.email}!</p>
          <p className="text-sm opacity-40 mb-8">User ID: {user.id}</p>
        </div>
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

async function getUser() {
  const supabase = await createClient();
  return supabase.auth.getUser();
}

function LoadingShell() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8 animate-pulse">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-48 rounded-md bg-white/10" />
          <div className="mx-auto h-5 w-56 rounded-md bg-white/5" />
          <div className="mx-auto h-4 w-40 rounded-md bg-white/5" />
        </div>
        <div className="flex justify-center">
          <div className="h-10 w-28 rounded-md bg-white/10" />
        </div>
      </div>
    </div>
  );
}
