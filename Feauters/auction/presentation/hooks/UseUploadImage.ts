"use client";

import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { UploadImageUseCase } from "../../domain/UseCase/uploadimage";

const auctionRepository = new SupabaseAuctionRepository();

const uploadImageUseCase =
  new UploadImageUseCase(auctionRepository);

export function useUploadImage() {
  return useMutation<string, Error, { id: string; image: File }>({
    mutationFn: ({ id, image }) =>
      uploadImageUseCase.execute(id,image),
  });
}