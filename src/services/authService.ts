import { supabase } from "@/config/supabase";
import type {
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "../schemas/auth";

/**
 * Login service
 */
export async function login(credentials: LoginFormData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Register service
 */
export async function register(formData: RegisterFormData) {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Logout service
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Reset password service
 */
export async function resetPassword(formData: ResetPasswordFormData) {
  const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

/**
 * Watch auth state changes
 */
export function onAuthStateChange(callback: (authenticated: boolean) => void) {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    callback(event === "SIGNED_IN");
  });

  return data;
}
