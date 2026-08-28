import { AuctionData } from "../entity/AuctionData";


export interface IAuctionRepository {
  createAuction(data: AuctionData): Promise<void>;
}