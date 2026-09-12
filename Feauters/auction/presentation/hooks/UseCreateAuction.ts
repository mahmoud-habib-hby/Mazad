"use client";

import { useMutation } from "@tanstack/react-query";
import { CreateAuctionUseCase } from "../../domain/UseCase/CreateAuctions";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { CreateAuctionData } from "../../domain/entity/CreateAuctionsData";



const auctionRepository = new SupabaseAuctionRepository();
const createAuctionUseCase = new CreateAuctionUseCase(auctionRepository);
export function UseCreateAuction() {
  return useMutation({
    mutationFn: (data:CreateAuctionData) => createAuctionUseCase.execute(data),
  });
}