"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input, Button } from "@/components/ui";
import Link from "next/link";
import toast from "react-hot-toast";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-2xl", className)} {...props}>
      {success ? (
        <div className="rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold tracking-tight text-2xl">
              Check Your Email
            </h3>
            <p className="text-sm text-muted-foreground">
              Password reset instructions sent
            </p>
          </div>
          <div className="pt-0">
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-6 flex flex-col gap-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold tracking-tight text-2xl">
              Reset Password
            </h3>
          </div>
          <div className="pt-0">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Remember your password?{' '}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
