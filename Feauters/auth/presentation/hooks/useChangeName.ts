"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuthRepository } from "../../data/Auth";
import { ChangeNameUseCase } from "../../domain/UseCase/ChangeName";


const authRepository = new SupabaseAuthRepository();
const changeNameUseCase = new ChangeNameUseCase(authRepository);

export function useChangeName() {
  return useMutation({
    mutationFn: (data: { userId: string; name: string }) =>
      changeNameUseCase.execute(data.userId, data.name),
  });
}