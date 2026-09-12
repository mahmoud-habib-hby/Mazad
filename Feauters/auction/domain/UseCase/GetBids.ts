import { BidData } from "../entity/BidsData";
import { IAuctionRepository } from "../repo/AuctionRepo";

export class GetBidsUseCase {
  constructor(
    private readonly auctionRepository: IAuctionRepository
  ) {}

  async execute(auctionId: string): Promise<BidData[]> {
    return this.auctionRepository.GetBids(auctionId);
  }
}