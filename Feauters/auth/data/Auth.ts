import { LoginData } from "../domain/entity/Login";
import { IAuthRepository } from "../domain/repo/AuthRepo";
import { RegisterData } from "../domain/entity/Register";
import { createClient } from "@/lib/supabase/client";

export class SupabaseAuthRepository implements IAuthRepository {
  async login(data: LoginData) {
    const supabase = createClient();

    const { data: authData, error } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  }

  async register(data: RegisterData) {
    const supabase = createClient();

    const { data: authData, error } =
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        },
      });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  }

  async logout(): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }
}