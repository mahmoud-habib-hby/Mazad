"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { LoginUseCase } from "../../domain/UseCase/Login";
import { LoginData } from "../../domain/entity/Login";

export function UseLogin() {
  const authRepository = new SupabaseAuthRepository();
  const loginUseCase = new LoginUseCase(authRepository);
  return useMutation({
    mutationFn: (data:LoginData) => loginUseCase.execute(data),
  });
}