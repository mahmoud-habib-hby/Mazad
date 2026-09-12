"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { PaidAuctionUseCase } from "../../domain/UseCase/PaidAuction";



const auctionRepository = new SupabaseAuctionRepository();
const PaidAuctionUseCase1 = new PaidAuctionUseCase(auctionRepository);
export function UsePaidAuction() {
  return useMutation({
    mutationFn: (userId: string) => PaidAuctionUseCase1.execute(userId),
  });
}