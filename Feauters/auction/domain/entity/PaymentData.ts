export interface PaymentData {
  id: string;
  auction_id: string;
  payer_id: string;
  amount: number;

  card_number: string;
  expiry_date: string;
  cvv: string;

  status: "pending" | "paid" | "failed" | "cancelled";

  created_at: string;
  paid_at: string | null;
}