import { AuctionCategory } from "./CategoryData";

export interface CreateAuctionData {
  id: string;
  title: string;
  description: string;
  category: AuctionCategory;
  starting_price: number;
  current_price: number;
  status: string;
  images: string[];
}