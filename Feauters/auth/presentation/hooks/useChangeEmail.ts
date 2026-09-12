"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { ChangeEmailUseCase } from "../../domain/UseCase/ChangeEmail";


const authRepository = new SupabaseAuthRepository();
const changeEmailUseCase = new ChangeEmailUseCase(authRepository);

export function useChangeEmail() {
  return useMutation({
    mutationFn: (data: { userId: string; email: string }) =>
      changeEmailUseCase.execute(data.userId, data.email),
  });
}