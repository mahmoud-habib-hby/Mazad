import { CreateAuctionData } from "../entity/CreateAuctionsData";
import { IAuctionRepository } from "../repo/AuctionRepo";



export class MyAuctionUseCase {
  constructor(private auctions: IAuctionRepository) {}

  async execute(id: string) {
    return await this.auctions.MyAuctions(id);
  }
}
