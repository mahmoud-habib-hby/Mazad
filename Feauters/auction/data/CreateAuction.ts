import { createClient } from "@/lib/supabase/client";
import { AuctionData } from "../domain/entity/AuctionData";
import { IAuctionRepository } from "../domain/repo/AuctionRepo";


export class SupabaseAuctionRepository implements IAuctionRepository {
    

  async createAuction(data: AuctionData): Promise<void> {
  const supabase =await createClient();
    const { error } = await supabase
      .from("auctions")
      .insert({
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        starting_price: data.starting_price,
        current_price: data.starting_price,
        start_time: data.start_time,
        end_time: data.end_time,
      });

    if (error) {
      throw new Error(error.message);
    }
  }
}