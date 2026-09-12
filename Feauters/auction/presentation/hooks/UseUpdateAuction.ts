import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { UpdateAuctionData } from "../../domain/entity/UpdateAuctionData";
import { UpdateAuctionUseCase } from "../../domain/UseCase/UpdateAuction";

const auctionRepository = new SupabaseAuctionRepository();
const updateAuctionUseCase = new UpdateAuctionUseCase(auctionRepository);
export function useUpdateAuction() {
  return useMutation({
    mutationFn: (data: UpdateAuctionData) =>
      updateAuctionUseCase.execute(data),
  });
}