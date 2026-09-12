import { AuctionData } from "../entity/AuctionData";
import { CreateAuctionData } from "../entity/CreateAuctionsData";
import { UpdateAuctionData } from "../entity/UpdateAuctionData";
import { BidData } from "../entity/BidsData";
import { PaymentData } from "../entity/PaymentData";

export interface IAuctionRepository {
  createAuction(data: CreateAuctionData): Promise<void>;
  updateAuction(data: UpdateAuctionData): Promise<void>;
  deleteAuction(auctionId: string): Promise<void>;
  getAuctionById(auctionId: string): Promise<AuctionData | null>;
  getAllAuctions(): Promise<AuctionData[]>;
  uploadAuctionImage(  auctionId: string, file: File):Promise <string>;
    deleteAuctionImage(auctionId: string,imageUrl: string): Promise<void>;
  saveAuctionImage( auctionId: string,imageUrl: string): Promise<void>;
  AddBids(auctionId: string, bidAmount: number):Promise<void>;
  GetBids(auctionId: string):Promise<BidData[]>;
  MyAuctions(sellerId: string): Promise<AuctionData[]>;
  finishAuction(auctionId: string): Promise<void>;
  CheckOut(data:PaymentData): Promise<void>;
  PaidAuction(userId: string): Promise<AuctionData[]>;
  MyAuction_unpaid(): Promise<AuctionData[]>;
  MyAuction_paid(): Promise<AuctionData[]>;
}
