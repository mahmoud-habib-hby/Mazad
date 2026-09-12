import { IAuctionRepository } from "../repo/AuctionRepo";

export class AddBidsUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(auctionId: string, bidAmount: number){
    return await this.auctions.AddBids(auctionId, bidAmount);
  }
}