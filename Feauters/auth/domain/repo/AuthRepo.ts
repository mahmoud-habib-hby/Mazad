import type { User, Session } from "@supabase/supabase-js";
import { LoginData } from "../entity/Login";
import { RegisterData } from "../entity/Register";

export interface IAuthRepository {
  login(data: LoginData): Promise<{
    user: User | null;
    session: Session | null;
  }>;

  register(data: RegisterData): Promise<{
    user: User | null;
    session: Session | null;
  }>;

  logout(): Promise<void>;
}