"use client";

import { useMutation } from "@tanstack/react-query";
import { CreateAuctionUseCase } from "../../domain/UseCase/CreateAuctions";
import { AuctionData } from "../../domain/entity/AuctionData";
import { SupabaseAuctionRepository } from "../../data/CreateAuction";



const auctionRepository = new SupabaseAuctionRepository();
const createAuctionUseCase = new CreateAuctionUseCase(auctionRepository);
export function UseCreateAuction() {
  return useMutation({
    mutationFn: (data:AuctionData) => createAuctionUseCase.execute(data),
  });
}