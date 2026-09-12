import { PaymentData } from "../entity/PaymentData";
import { IAuctionRepository } from "../repo/AuctionRepo";

export class CheckOutUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(data: PaymentData){
    return await this.auctions.CheckOut(data);
  }
}