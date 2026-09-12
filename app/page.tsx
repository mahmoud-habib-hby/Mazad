import AllAuctionsPage from "@/Feauters/auction/presentation/component/AllAuctions/page";
import CreateAuctionPage from "@/Feauters/auction/presentation/component/CreateAuction/CreateAuction";
import AuctionDetailsPage from "@/Feauters/auction/presentation/component/GetAuctionById/GetAuctionById";
import LoginPage from "@/Feauters/auth/presentation/component/LoginPage";
import Register from "@/Feauters/auth/presentation/component/Register";
// import RegisterPage from "@/Feauters/auth/presentation/component/Register";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: todos } = await supabase
    .from("bids")
    .select("*");
  
  console.log(todos);

  return (
  <>
   <LoginPage/>
   
  </>
  );
}