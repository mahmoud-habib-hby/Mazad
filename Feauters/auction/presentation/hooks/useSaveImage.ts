"use client";

import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { SaveImageUseCase } from "../../domain/UseCase/SaveImage";

const auctionRepository = new SupabaseAuctionRepository();

const saveImage = new SaveImageUseCase(auctionRepository);

export function useSaveImage() {
  return useMutation({
    mutationFn: (data: { id: string; url: string }) =>
      saveImage.execute(data.id, data.url),
  });
}