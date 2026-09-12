"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { GetAuctionByIdUseCase } from "../../domain/UseCase/GetAuctionById";



const auctionRepository = new SupabaseAuctionRepository();
const GetAuctionById = new GetAuctionByIdUseCase(auctionRepository);
export function useGetAuctionById() {
  return useMutation({
    mutationFn: (id: string) => GetAuctionById.execute(id),
  });
}