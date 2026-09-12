import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { MyAuctionUseCase } from "../../domain/UseCase/MyAuction";

const auctionRepository = new SupabaseAuctionRepository();
const MyAction = new MyAuctionUseCase(auctionRepository);
export function useMyAuctions() {
  return useMutation({
    mutationFn: (id:string) =>
      MyAction.execute(id),
  });
}