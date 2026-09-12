"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { FinishAuctionUseCase } from "../../domain/UseCase/finichAuction";



const auctionRepository = new SupabaseAuctionRepository();
const FinishAuction = new FinishAuctionUseCase(auctionRepository);
export function useFinishAuction() {
  return useMutation({
    mutationFn: (id: string) => FinishAuction.execute(id),
  });
}