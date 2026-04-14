"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import Input from "@/components/ui/input";
import Button from "../ui/button";
import Select from "../ui/select";
import { signUpAction } from "@/actions/auth";

const initialState = { error: null };

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    if (password !== repeatPassword) {
      setMatchError("Passwords do not match");
      return;
    }
    setMatchError(null);
    formAction(formData);
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
      <form action={handleSubmit}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <Input
            id="full-name"
            name="full-name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Role Select */}
          <Select
            id="role"
            name="role"
            label="Role"
            defaultValue="SALESMAN"
            options={[
              { value: "OWNER", label: "Owner" },
              { value: "SALESMAN", label: "Salesman" },
            ]}
          />

          {/* Email Input */}
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Password Input */}
          <Input
            id="password"
            name="password"
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
            name="repeat-password"
            label="Repeat Password"
            type="password"
            required
            placeholder="*****"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Error Messages */}
          {(matchError || state.error) && (
            <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium">
              {matchError ?? state.error}
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Creating an account..." : "Sign up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
