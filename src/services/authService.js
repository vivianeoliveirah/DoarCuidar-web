import { supabase } from "./supabase";

export async function registerUser({ email, password }) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function loginUser({ email, password }) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function logout() {
  return await supabase.auth.signOut();
}