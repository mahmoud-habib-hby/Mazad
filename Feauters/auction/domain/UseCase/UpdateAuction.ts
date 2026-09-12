import { UpdateAuctionData } from "../entity/UpdateAuctionData";
import { IAuctionRepository } from "../repo/AuctionRepo";

export class UpdateAuctionUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute( data: UpdateAuctionData){
    return await this.auctions.updateAuction(data);
  }
}