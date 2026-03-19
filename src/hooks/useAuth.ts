import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import type { AuthSession } from "@/types";

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setSession({
            user: {
              id: data.session.user.id,
              email: data.session.user.email || "",
              name: data.session.user.user_metadata?.name || "",
              created_at: data.session.user.created_at,
            },
            loading: false,
            error: null,
          });
        } else {
          setSession({ user: null, loading: false, error: null });
        }
      } catch (error) {
        setSession({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    getSession();

    // Listen to auth changes
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setSession({
            user: {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || "",
              created_at: session.user.created_at,
            },
            loading: false,
            error: null,
          });
        } else {
          setSession({ user: null, loading: false, error: null });
        }
      },
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return session;
}
