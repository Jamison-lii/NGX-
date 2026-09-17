import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const loadUserProfile = async (authUser) => {
  if (!authUser) {
    setUser(null);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, created_at")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    console.error("Error loading user profile:", profileError);
    setUser(null);
    return;
  }

 let permissions = {
  canCreatePosts: profile.role === "admin",
  canUpdatePosts: profile.role === "admin",
  canDeletePosts: profile.role === "admin",
};

  if (profile.role === "member") {
    const { data: memberPermissions, error: permissionsError } =
      await supabase
        .from("member_permissions")
        .select(
          "can_create_posts, can_update_posts, can_delete_posts"
        )
        .eq("user_id", authUser.id)
        .maybeSingle();

    if (permissionsError) {
      console.error(
        "Error loading member permissions:",
        permissionsError
      );
    } else if (memberPermissions) {
      permissions = {
        canCreatePosts: memberPermissions.can_create_posts,
        canUpdatePosts: memberPermissions.can_update_posts,
        canDeletePosts: memberPermissions.can_delete_posts,
      };
    }
  }

  setUser({
    id: authUser.id,
    email: authUser.email,
    fullName: profile.full_name,
    role: profile.role,
    isActive: profile.is_active,
    createdAt: profile.created_at,

    permissions,
  });
};

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      } else {
        await loadUserProfile(data.session?.user ?? null);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await loadUserProfile(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};