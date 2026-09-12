"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";

import { SaveImageUseCase } from "../../domain/UseCase/SaveImage";

export function UseSaveImage() {
  const authRepository = new SupabaseAuthRepository();
  const saveImageUseCase = new SaveImageUseCase(authRepository);
  return useMutation({
    mutationFn: (data: { userId: string; imageUrl: string }) => saveImageUseCase.execute(data.userId, data.imageUrl),
  });
}