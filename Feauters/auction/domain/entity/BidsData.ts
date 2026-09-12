export interface BidData {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  bidder_name: string | null;
  bidder_phone: string | null;
}