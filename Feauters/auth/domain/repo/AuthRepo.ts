import type { User, Session } from "@supabase/supabase-js";
import { LoginData } from "../entity/Login";
import { RegisterData } from "../entity/Register";
import { ProfileData } from "../entity/profile";

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
  ProfileInfo(userId: string): Promise<ProfileData>;
  ChangeImage(userId: string, imageUrl: string): Promise<void>;
  ChangeName(userId: string, name: string): Promise<void>;
  ChangeEmail(userId: string, email: string): Promise<void>;
  ChangePassword(userId: string, password: string): Promise<void>;
  SaveImage(userId: string, imageUrl: string): Promise<void>;
  UploadImage(userId: string, file: File): Promise<string>;
  RemoveImage(userId: string, imageUrl: string): Promise<void>;
}