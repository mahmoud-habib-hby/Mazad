import { IAuctionRepository } from "../repo/AuctionRepo";



export class PaidAuctionUseCase {
  constructor(private auctions: IAuctionRepository) {}

  async execute(userId: string) {
    return await this.auctions.PaidAuction(userId);
  }
}
