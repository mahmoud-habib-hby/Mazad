import { IAuctionRepository } from "../repo/AuctionRepo";

export class MyAuctionPaidUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(){
    return await this.auctions.MyAuction_paid();
  }
}