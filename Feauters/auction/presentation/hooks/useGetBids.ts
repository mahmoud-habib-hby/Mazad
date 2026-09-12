"use client";

import { useQuery } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { GetBidsUseCase } from "../../domain/UseCase/GetBids";

const repository =
  new SupabaseAuctionRepository();

const getBidsUseCase =
  new GetBidsUseCase(repository);

export const useGetBids = (
  auctionId: string
) => {
  return useQuery({
    queryKey: ["bids", auctionId],

    queryFn: () =>
      getBidsUseCase.execute(auctionId),

    enabled: !!auctionId,
  });
};