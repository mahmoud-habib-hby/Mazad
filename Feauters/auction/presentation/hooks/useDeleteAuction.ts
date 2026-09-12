"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { DeleteAuctionUseCase } from "../../domain/UseCase/DeleteAuction";



const auctionRepository = new SupabaseAuctionRepository();
const deleteAuctionUseCase1 = new DeleteAuctionUseCase(auctionRepository);
export function UseDeleteAuction() {
  return useMutation({
    mutationFn: (data: { auctionId: string }) => deleteAuctionUseCase1.execute(data.auctionId),
  });
}