import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { GetAllAuctionsUseCase } from "../../domain/UseCase/GetAllAuction";

const auctionRepository = new SupabaseAuctionRepository();
const AllAction = new GetAllAuctionsUseCase(auctionRepository);
export function useAllAuctions() {
  return useMutation({
    mutationFn: () =>
      AllAction.execute(),
  });
}