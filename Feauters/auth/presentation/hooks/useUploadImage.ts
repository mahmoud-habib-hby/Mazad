"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";

import { UploadImageUseCase } from "../../domain/UseCase/UploadImage";

export function UseUploadImage() {
  const authRepository = new SupabaseAuthRepository();
  const uploadImageUseCase = new UploadImageUseCase(authRepository);
  return useMutation({
    mutationFn: (data: { userId: string; file: File }) => uploadImageUseCase.execute(data.userId, data.file),
  });
}