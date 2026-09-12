"use client";

import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { ReomveImageUseCase } from "../../domain/UseCase/RemoveImage";

const auctionRepository = new SupabaseAuctionRepository();

const removeImage = new ReomveImageUseCase(auctionRepository);

export function UseRermoveImage() {
  return useMutation({
    mutationFn: (data: { id: string; url: string }) =>
      removeImage.execute(data.id, data.url),
  });
}