import { IAuctionRepository } from "../repo/AuctionRepo";

export class GetAllAuctionsUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(){
    return await this.auctions.getAllAuctions();
  }
}