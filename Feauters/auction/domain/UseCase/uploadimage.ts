import { IAuctionRepository } from "../repo/AuctionRepo";



export class UploadImageUseCase {
  constructor(private auctions: IAuctionRepository) {}

  async execute(id:string,image:File) {
    return await this.auctions.uploadAuctionImage(id,image);
  }
}
