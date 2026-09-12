export interface AuctionBid {
  id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
}

export interface AuctionData {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  starting_price: number;
  Winner_id?: string | null;
  current_price: number;
  status: string;
  images: string[];
  bids?: AuctionBid[];
}