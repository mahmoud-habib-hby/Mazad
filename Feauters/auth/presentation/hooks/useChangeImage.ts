"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { ChangeImageUseCase } from "../../domain/UseCase/ChageImage";


const authRepository = new SupabaseAuthRepository();
const changeImageUseCase = new ChangeImageUseCase(authRepository);

export function useChangeImage() {
  return useMutation({
    mutationFn: (data: { userId: string; image: string }) =>
      changeImageUseCase.execute(data.userId, data.image),
  });
}