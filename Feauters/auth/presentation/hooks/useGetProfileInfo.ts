"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";

import { ProfileInfoUseCase } from "../../domain/UseCase/ProfileInfo";

export function UseGetProfileInfo() {
  const authRepository = new SupabaseAuthRepository();
  const profileInfoUseCase = new ProfileInfoUseCase(authRepository);
  return useMutation({
    mutationFn: (userId: string) => profileInfoUseCase.execute(userId),
  });
}