import { CreateAuctionData } from "../entity/CreateAuctionsData";
import { IAuctionRepository } from "../repo/AuctionRepo";



export class CreateAuctionUseCase {
  constructor(private auctions: IAuctionRepository) {}

  async execute(data: CreateAuctionData) {
    return await this.auctions.createAuction(data);
  }
}
