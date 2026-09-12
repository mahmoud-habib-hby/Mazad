import { AuctionCategory } from "./CategoryData";

export interface UpdateAuctionData {
  id: string;

  title: string;

  description: string;

  category: AuctionCategory;

  starting_price: number;



  status: string;
  images: string[];
}
