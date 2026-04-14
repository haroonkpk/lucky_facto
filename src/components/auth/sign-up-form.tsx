"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/input";
import Button from "../ui/button";
import Select from "../ui/select";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("SALESMAN");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });
      if (error) throw error;
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white p-[clamp(1.5rem,3vw,2.5rem)] rounded-xl shadow-xs max-w-2xl w-full mx-auto",
        className,
      )}
      {...props}
    >
      {/* Header Section */}
      <div className="mb-[clamp(1.5rem,3vw,2rem)]">
        <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
          Sign up
        </h2>
        <p className="text-[#64748B] text-[clamp(0.875rem,1vw,1rem)]">
          Create a new account to get started
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">

          <Input
            id="full-name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Role Select */}
          <Select
            id="role"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "OWNER", label: "Owner" },
              { value: "SALESMAN", label: "Salesman" },
            ]}
          />

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

          {/* Password Input */}
          <Input
            id="password"
            label="Password"
            type="password"
            required
            placeholder="*****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Repeat Password Input */}
          <Input
            id="repeat-password"
            label="Repeat Password"
            type="password"
            required
            placeholder="*****"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Error Message */}
          {error && (
            <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Creating an account..." : "Sign up"}
          </Button>

        </div>
      </form>
    </div>
  );
}