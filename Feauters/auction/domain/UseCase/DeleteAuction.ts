import { IAuctionRepository } from "../repo/AuctionRepo";

export class DeleteAuctionUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(auctionid: string){
    return await this.auctions.deleteAuction(auctionid);
  }
}