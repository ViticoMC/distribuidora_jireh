import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import type { AuthSession } from "@/types";

async function getRole(id: string) {
  if (!id) return null;
  const { data: role } = await supabase
    .from("user")
    .select("role")
    .eq("id", id)
    .single();

  return role?.role;
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get current session
    const getSession = async () => {

      setSession((prev) => ({ ...prev, loading: true }));
      try {
        const { data } = await supabase.auth.getSession();
        const role = await getRole(data.session?.user.id || "");


        if (data.session?.user && role) {
          setSession({
            user: {
              id: data.session.user.id,
              email: data.session.user.email || "",
              name: data.session.user.user_metadata?.name || "",
              created_at: data.session.user.created_at,
              role: role,
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
    // const { data } = supabase.auth.onAuthStateChange(
    //   async (_event, session) => {
    //     if (session?.user) {
    //       const role = await getRole(session.user.id);
    //       setSession({
    //         user: {
    //           id: session.user.id,
    //           email: session.user.email || "",
    //           name: session.user.user_metadata?.name || "",
    //           created_at: session.user.created_at,
    //           role: role,
    //         },
    //         loading: false,
    //         error: null,
    //       });
    //     } else {
    //       setSession({ user: null, loading: false, error: null });
    //     }
    //   },
    // );

    // return () => {
    //   data.subscription.unsubscribe();
    // };
  }, []);

  return session;
}
