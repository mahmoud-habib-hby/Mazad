"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { ChangePasswordUseCase } from "../../domain/UseCase/ChangePassword";


const authRepository = new SupabaseAuthRepository();
const changePasswordUseCase = new ChangePasswordUseCase(authRepository);

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { userId: string; password: string }) =>
      changePasswordUseCase.execute(data.userId, data.password),
  });
}