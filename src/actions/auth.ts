"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
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