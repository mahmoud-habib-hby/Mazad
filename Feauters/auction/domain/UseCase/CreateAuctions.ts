import { AuctionData } from "../entity/AuctionData";
import { IAuctionRepository } from "../repo/AuctionRepo";



export class CreateAuctionUseCase {
  constructor(private auctions: IAuctionRepository) {}

  async execute(data: AuctionData) {
    return await this.auctions.createAuction(data);
  }
}
