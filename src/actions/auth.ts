"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// login
type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const userRole = data.user?.user_metadata?.role;

  if (userRole === "OWNER") {
    redirect("/owner-dashboard");
  } else if (userRole === "SALESMAN") {
    redirect("/salesman-dashboard");
  } else {
    redirect("/");
  }
}

// Sign Up
type SignUpState = {
  error: string | null;
};

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const fullName = formData.get("full-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}
