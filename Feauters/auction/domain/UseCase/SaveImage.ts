import { IAuctionRepository } from "../repo/AuctionRepo";



export class SaveImageUseCase {
  constructor(private auctions: IAuctionRepository) {}
  async execute(id:string,url:string) {
    return await this.auctions.saveAuctionImage(id,url);
  }
}
