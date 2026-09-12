import { IAuctionRepository } from "../repo/AuctionRepo";

export class GetAuctionByIdUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(auctionid: string){
    return await this.auctions.getAuctionById(auctionid);
  }
}