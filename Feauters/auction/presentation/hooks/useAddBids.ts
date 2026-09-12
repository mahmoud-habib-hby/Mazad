"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { AddBidsUseCase } from "../../domain/UseCase/AddBids";



const auctionRepository = new SupabaseAuctionRepository();
const ADDBidsUseCase = new AddBidsUseCase(auctionRepository);
export function UseAddBids() {
  return useMutation({
    mutationFn: (data: { auctionId: string; bidAmount: number }) => ADDBidsUseCase.execute(data.auctionId, data.bidAmount),
  });
}