"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { LogoutUseCase } from "../../domain/UseCase/LogOut";
export function UseLogout() {
  const authRepository = new SupabaseAuthRepository();
  const logoutUseCase = new LogoutUseCase(authRepository);
  return useMutation({
    mutationFn: () => logoutUseCase.execute(),
  });
}