"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/input";
import Link from "next/link";
import Button from "../ui/button";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      const userRole = data.user?.user_metadata?.role;

      if (userRole === "OWNER") {
        router.push("/owner-dashboard"); 
      } else if (userRole === "SALESMAN") {
        router.push("/salesman-dashboard"); 
      } else {
        router.push("/");
      }

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white p-[clamp(1.5rem,3vw,2.5rem)] rounded-xl shadow-xs w-full max-w-xl mx-auto",
        className,
      )}
      {...props}
    >
      {/* Header Section */}
      <div className="mb-[clamp(1.5rem,3vw,2rem)]">
        <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
          Login
        </h2>
        <p className="text-[#64748B] text-[clamp(0.875rem,1vw,1rem)]">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          
          {/* Email Input */}
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Password Input Group */}
          <div className="relative w-full">
            <Link
              href="/auth/forgot-password"
              className="absolute right-0 top-0 text-[clamp(0.7rem,1vw,0.8rem)] text-[var(--color-primary)] font-medium underline-offset-4 hover:underline z-10"
            >
              Forgot your password?
            </Link>
            <Input
              id="password"
              label="Password"
              type="password"
              required
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}