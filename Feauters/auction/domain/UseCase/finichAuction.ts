import { IAuctionRepository } from "../repo/AuctionRepo";

export class FinishAuctionUseCase {
  constructor(private auctionRepository: IAuctionRepository) {}

  async execute(auctionId: string): Promise<void> {
    await this.auctionRepository.finishAuction(auctionId);
  }
}