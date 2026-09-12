import { IAuctionRepository } from "../repo/AuctionRepo";



export class ReomveImageUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(id:string,url:string) {
    return await this.auctions.deleteAuctionImage(id,url);
  }
}
