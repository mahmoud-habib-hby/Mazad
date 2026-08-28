

  export interface AuctionData {
  title: string;
  description?: string;
  image_url?: string;
  starting_price: number;
  current_price: number;
  start_time: string;
  end_time: string;
  status: "not_ready" | "active" | "ended";
}