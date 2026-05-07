"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/enums";

// ─── Login ────────────────────────────────────────────────────────────────────

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
    redirect("/owner/dashboard");
  } else if (userRole === "SALESMAN") {
    redirect("/salesman/dashboard");
  } else {
    redirect("/");
  }
}

// Admin-Only: Register Salesman 
export type RegisterSalesmanState = {
  success: boolean;
  error: string | null;
};

export async function registerSalesmanAction(
  _prevState: RegisterSalesmanState,
  formData: FormData,
): Promise<RegisterSalesmanState> {
  const fullName = formData.get("full-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const {
    data: { user: callerUser },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !callerUser) {
    return { success: false, error: "Unauthorized: no active session." };
  }

  if (callerUser.user_metadata?.role !== "OWNER") {
    return { success: false, error: "Unauthorized: only Owners can register new salesmen." };
  }

  // Create the auth user via Admin API 
  const adminClient = createAdminClient();
  const { data: newAuthUser, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,          
      user_metadata: {
        full_name: fullName,
        role: "SALESMAN",
      },
    });

  if (createError || !newAuthUser.user) {
    return {
      success: false,
      error: createError?.message ?? "Failed to create auth user.",
    };
  }

  try {
    await prisma.user.upsert({
      where: { id: newAuthUser.user.id },
      update: {
        name: fullName,
        role: Role.SALESMAN,
      },
      create: {
        id: newAuthUser.user.id,   
        name: fullName,
        email,
        role: Role.SALESMAN,
      },
    });
  } catch (prismaError) {
    await adminClient.auth.admin.deleteUser(newAuthUser.user.id);
    const message =
      prismaError instanceof Error ? prismaError.message : "Database error.";
    return { success: false, error: message };
  }

  revalidatePath("/owner/salesman-management");
  revalidatePath("/owner/dashboard");
  return { success: true, error: null };
}

export async function deleteSalesmanAction(userId: string) {
  const supabase = await createClient();
  const {
    data: { user: callerUser },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !callerUser) {
    return { success: false, error: "Unauthorized: no active session." };
  }

  if (callerUser.user_metadata?.role !== "OWNER") {
    return { success: false, error: "Unauthorized: only Owners can delete salesmen." };
  }

  const adminClient = createAdminClient();

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) {
      throw new Error(deleteError.message);
    }

    revalidatePath("/owner/salesman-management");
    revalidatePath("/owner/dashboard");
    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete salesman. They may have related records.";
    return { success: false, error: message };
  }
}
