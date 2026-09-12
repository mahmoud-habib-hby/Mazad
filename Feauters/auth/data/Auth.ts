import { LoginData } from "../domain/entity/Login";
import { IAuthRepository } from "../domain/repo/AuthRepo";
import { RegisterData } from "../domain/entity/Register";
import { createClient } from "@/lib/supabase/client";
import { ProfileData } from "../domain/entity/profile";

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
async ProfileInfo(userId: string): Promise<ProfileData> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("المستخدم غير موجود");
  }

  // نتأكد أن المستخدم المطلوب هو المستخدم الحالي
  if (user.id !== userId) {
    throw new Error("غير مصرح لك");
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.name ?? "",
    image: user.user_metadata?.image ?? "",
  };
}
  async logout(): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }
  async ChangeImage(
  userId: string,
  imageUrl: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("المستخدم غير موجود");
  }

  if (user.id !== userId) {
    throw new Error("غير مصرح لك بتغيير الصورة");
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      image: imageUrl,
    },
  });

  if (error) {
    console.error(
      "SUPABASE CHANGE IMAGE ERROR:",
      error.message
    );

    throw new Error(error.message);
  }
}
async ChangeName(
  userId: string,
  name: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user || user.id !== userId) {
    throw new Error("غير مصرح لك بتغيير الاسم");
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      name: name,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
async ChangeEmail(
  userId: string,
  email: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user || user.id !== userId) {
    throw new Error("غير مصرح لك بتغيير البريد الإلكتروني");
  }

  const { error } = await supabase.auth.updateUser({
    email: email,
  });

  if (error) {
    throw new Error(error.message);
  }
}
async ChangePassword(
  userId: string,
  password: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user || user.id !== userId) {
    throw new Error("غير مصرح لك بتغيير كلمة المرور");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

  async UploadImage(
    userId: string,
    file: File
  ): Promise<string> {
    const supabase = await createClient();

    // المستخدم الحالي
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // التأكد أن المستخدم يعدل صورته هو
    if (user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // امتداد الصورة
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    // مسار الصورة داخل Storage
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;

    // رفع الصورة
    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // الحصول على Public URL
    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(path);

    if (!data.publicUrl) {
      throw new Error("Failed to get image URL");
    }

    return data.publicUrl;
  }


  // =========================================
  // Save Image URL in auth.users
  // =========================================

  async SaveImage(
    userId: string,
    imageUrl: string
  ): Promise<void> {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    if (user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // حفظ رابط الصورة في auth.users
    // داخل raw_user_meta_data
    const { error } = await supabase.auth.updateUser({
      data: {
        image: imageUrl,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }


  // =========================================
  // Remove Profile Image
  // =========================================

  async RemoveImage(
    userId: string,
    imageUrl: string
  ): Promise<void> {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    if (user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // -----------------------------------------
    // استخراج path من URL
    // -----------------------------------------

    const marker = "/profile-images/";

    const index = imageUrl.indexOf(marker);

    if (index === -1) {
      throw new Error("Invalid profile image URL");
    }

    const path = decodeURIComponent(
      imageUrl.substring(index + marker.length)
    );

    // التأكد أن الصورة تخص المستخدم
    if (!path.startsWith(`${userId}/`)) {
      throw new Error("Unauthorized image");
    }

    // -----------------------------------------
    // حذف الصورة من Storage
    // -----------------------------------------

    const { error: removeError } = await supabase.storage
      .from("profile-images")
      .remove([path]);

    if (removeError) {
      throw new Error(removeError.message);
    }

    // -----------------------------------------
    // حذف الرابط من auth.users
    // -----------------------------------------

    const { error: updateError } =
      await supabase.auth.updateUser({
        data: {
          image: null,
        },
      });

    if (updateError) {
      throw new Error(updateError.message);
    }
  }
}