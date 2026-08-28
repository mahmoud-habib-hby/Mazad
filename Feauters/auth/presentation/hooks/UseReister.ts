"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { RegisterData } from "../../domain/entity/Register";
import { RegisterUseCase } from "../../domain/UseCase/Register";

export function UseRegister() {
  const authRepository = new SupabaseAuthRepository();
  const registerUseCase = new RegisterUseCase(authRepository);
  return useMutation({
    mutationFn: (data: RegisterData) => registerUseCase.execute(data),
  });
}