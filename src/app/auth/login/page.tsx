"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Input, Button } from "@/components/ui";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

const initialState = { error: null };

export default function Page() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div
        className={cn(
          "bg-white p-[clamp(1.5rem,3vw,2.5rem)] rounded-xl shadow-xs w-full max-w-xl mx-auto",
        )}
      >
        <div className="mb-[clamp(1.5rem,3vw,2rem)]">
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Login
          </h2>

        </div>

        <form action={formAction}>
          <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />

            <div className="relative w-full">
              <Link
                href="/auth/forgot-password"
                className="absolute right-0 top-0 text-[clamp(0.7rem,1vw,0.8rem)] text-[var(--color-primary)] font-medium underline-offset-4 hover:underline z-10"
              >
                Forgot your password?
              </Link>
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                required
                placeholder="******"
                className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
              />
            </div>

            {state.error && (
              <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium">
                {state.error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
