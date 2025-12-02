"use client";

import { useActionState, useOptimistic, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useParams } from "next/navigation";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { motion } from "motion/react";
import { useAnim } from "@/hooks/useAnim";
import { cn } from "@/lib/utils";

type LoginState = {
  status: "idle" | "pending" | "success" | "error";
  message?: string;
};

const initialState: LoginState = {
  status: "idle",
  message: undefined,
};

export default function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { anim: shouldAnimate } = useAnim();

  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const redirectTo = searchParams.get("redirectTo") || `/${locale}/admin`;

  const [state, loginAction, isPending] = useActionState<LoginState, FormData>(
    async (_previousState, formData) => {
      const email = (formData.get("email") as string | null)?.trim();

      if (!email) {
        return {
          status: "error",
          message: "Please enter a valid email address.",
        };
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
              redirectTo,
            )}`,
          },
        });

        if (error) throw error;

        formRef.current?.reset();

        return {
          status: "success",
          message: "Check your email for the magic link!",
        };
      } catch (error) {
        return {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred. Please try again.",
        };
      }
    },
    initialState,
  );

  const [optimisticState, setOptimisticState] = useOptimistic<
    LoginState,
    LoginState
  >(state, (_currentState, nextState) => nextState);

  const currentState = isPending ? optimisticState : state;
  const isSuccess = currentState.status === "success";

  const handleLogin = (formData: FormData) => {
    const email = (formData.get("email") as string | null)?.trim();

    setOptimisticState({
      status: "pending",
      message: email ? `Sending link to ${email}...` : "Sending link...",
    });

    return loginAction(formData);
  };

  return (
    <main
      className={cn(
        !shouldAnimate && "bg-background",
        "relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16",
      )}
    >
      {shouldAnimate ? (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle at 20% 20%, rgba(255,0,0,0.15), transparent 40%)",
                "radial-gradient(circle at 80% 80%, rgba(255,0,0,0.15), transparent 40%)",
                "radial-gradient(circle at 20% 20%, rgba(255,0,0,0.15), transparent 40%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle at 80% 10%, rgba(255,0,0,0.1), transparent 35%)",
                "radial-gradient(circle at 20% 90%, rgba(255,0,0,0.1), transparent 35%)",
                "radial-gradient(circle at 80% 10%, rgba(255,0,0,0.1), transparent 35%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle at 50% 60%, rgba(255,0,0,0.08), transparent 30%)",
                "radial-gradient(circle at 60% 30%, rgba(255,0,0,0.08), transparent 30%)",
                "radial-gradient(circle at 50% 60%, rgba(255,0,0,0.08), transparent 30%)",
              ],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,0,0,0.08),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(255,0,0,0.06),transparent_30%)] blur-3xl"
        />
      )}

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8">
        <motion.div
          className="text-center"
          {...(shouldAnimate && {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: "easeOut" },
          })}
        >
          <h1 className="text-4xl sm:text-5xl font-semibold leading-none text-primary">
            Welcome to Studio
          </h1>
        </motion.div>

        <div className="w-full space-y-4">
          <motion.form
            ref={formRef}
            className="w-full"
            action={handleLogin}
            aria-label="Request a magic link to sign in"
            {...(shouldAnimate && {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
            })}
          >
            <div
              className={`relative overflow-hidden sm:rounded-3xl sm:border border-primary/10 ${
                shouldAnimate
                  ? "bg-background/30 backdrop-blur-2xl"
                  : "sm:bg-background/60"
              } sm:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)] sm:ring-1 ring-primary/5 transition-all duration-300 hover:shadow-[0_20px_80px_-30px_rgba(255,0,0,0.2)]`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent ${
                  shouldAnimate && "animate-pulse"
                }`}
              />
              <div
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent ${
                  shouldAnimate && "animate-pulse"
                }`}
              />

              <div className="space-y-6 py-8 sm:p-8">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary/80"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full rounded-xl border border-primary/15 px-4 py-3.5 text-base text-primary ${
                      shouldAnimate
                        ? "bg-background/40 backdrop-blur-sm"
                        : "bg-background/70"
                    } shadow-sm transition-all duration-200 placeholder:text-primary/40 sm:focus:border-accent/60 focus:outline-none sm:focus:ring-4 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50`}
                    placeholder="you@alee.az"
                    disabled={isPending || isSuccess}
                  />
                </div>

                <SubmitButton
                  shouldAnimate={shouldAnimate}
                  isSuccess={isSuccess}
                />

                <p className="text-xs text-primary/50 text-center absolute left-1/2 bottom-4 -translate-x-1/2 text-nowrap">
                  The link expires in 1 hour for security
                </p>
              </div>
            </div>
          </motion.form>

          <div className="flex h-16 items-center justify-center">
            {currentState.message && (
              <motion.p
                {...(shouldAnimate && {
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 },
                })}
                className={cn(
                  "text-center text-sm font-normal",
                  currentState.status === "error"
                    ? "text-accent"
                    : currentState.status === "success"
                      ? "text-primary"
                      : "text-primary/70",
                )}
                aria-live="polite"
              >
                {currentState.message}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SubmitButton({
  shouldAnimate,
  isSuccess,
}: {
  shouldAnimate: boolean;
  isSuccess: boolean;
}) {
  const { pending } = useFormStatus();
  const disabled = pending || isSuccess;

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-4 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        shouldAnimate && "active:scale-[0.98]",
      )}
    >
      {shouldAnimate && (
        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
      )}

      {pending ? (
        <>
          {shouldAnimate && (
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          )}
          <span>Sending link...</span>
        </>
      ) : isSuccess ? (
        <>
          <IoCheckmarkCircleOutline className="h-5 w-5" />
          <span>Link sent</span>
        </>
      ) : (
        <span>Send magic link</span>
      )}
    </button>
  );
}
