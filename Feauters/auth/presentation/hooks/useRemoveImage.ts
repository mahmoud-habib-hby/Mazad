"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";

import { RemoveImageUseCase } from "../../domain/UseCase/RemoveImage";

export function UseRemoveImage() {
  const authRepository = new SupabaseAuthRepository();
  const removeImageUseCase = new RemoveImageUseCase(authRepository);
  return useMutation({
    mutationFn: (data: { userId: string; imageUrl: string }) => removeImageUseCase.execute(data.userId, data.imageUrl),
  });
}