import { createClient } from "@/lib/supabase/client";
import { AuctionData } from "../domain/entity/AuctionData";
import { IAuctionRepository } from "../domain/repo/AuctionRepo";
import { CreateAuctionData } from "../domain/entity/CreateAuctionsData";
import { UpdateAuctionData } from "../domain/entity/UpdateAuctionData";
import { BidData } from "../domain/entity/BidsData";
import { PaymentData } from "../domain/entity/PaymentData";

export class SupabaseAuctionRepository implements IAuctionRepository {

async createAuction(data: CreateAuctionData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .insert({
    id: data.id,
      seller_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      starting_price: data.starting_price,
      current_price: data.starting_price,
      status: data.status,
    })
    .select("id")
    .single();

  if (auctionError) {
    throw new Error(auctionError.message);
  }

  // حفظ الصور بعد إنشاء المزاد
  if (data.images.length > 0) {
    const imagesData = data.images.map((url) => ({
      auction_id: auction.id,
      image_url: url,
    }));

    const { error: imagesError } = await supabase
      .from("auction_images")
      .insert(imagesData);

    if (imagesError) {
      throw new Error(imagesError.message);
    }
  }
}

async updateAuction(data: UpdateAuctionData): Promise<void> {
  const supabase = await createClient();


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  if (!data.id) {
    throw new Error("Auction ID is required");
  }


  const { error: auctionError } = await supabase
    .from("auctions")
    .update({
      title: data.title,
      description: data.description,
      category: data.category,
      starting_price: data.starting_price,

      status: data.status,
    })
    .eq("id", data.id)
    .eq("seller_id", user.id);

  if (auctionError) {
    throw new Error(auctionError.message);
  }
}
async deleteAuctionImage(
  auctionId: string,
  imageUrl: string
): Promise<void> {
  const supabase = await createClient();

  // Check image
  const { data: image, error: findError } = await supabase
    .from("auction_images")
    .select("*")
    .eq("auction_id", auctionId)
    .eq("image_url", imageUrl);

  console.log("AUCTION ID:", auctionId);
  console.log("IMAGE URL:", imageUrl);
  console.log("IMAGE FOUND:", image);

  if (findError) {
    throw new Error(findError.message);
  }

  if (!image || image.length === 0) {
    throw new Error("الصورة غير موجودة في قاعدة البيانات");
  }

  // Delete from database
  const { data: deleted, error: dbError } = await supabase
    .from("auction_images")
    .delete()
    .eq("auction_id", auctionId)
    .eq("image_url", imageUrl)
    .select();

  console.log("DELETED IMAGE:", deleted);

  if (dbError) {
    throw new Error(dbError.message);
  }

  if (!deleted || deleted.length === 0) {
    throw new Error(
      "لم يتم حذف الصورة. تحقق من RLS Policy"
    );
  }

  // Storage path
  const marker = "/auction-images/";
  const index = imageUrl.indexOf(marker);

  if (index === -1) {
    throw new Error("Invalid image URL");
  }

  const path = decodeURIComponent(
    imageUrl.substring(index + marker.length)
  );

  console.log("STORAGE PATH:", path);

  // Delete from Storage
  const { error: storageError } = await supabase.storage
    .from("auction-images")
    .remove([path]);

  if (storageError) {
    throw new Error(storageError.message);
  }
}
async uploadAuctionImage(
  auctionId: string,
  file: File
): Promise<string> {
  const supabase = await createClient();

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const path = `${auctionId}/${fileName}`;

  const { error } = await supabase.storage
    .from("auction-images")
    .upload(path, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("auction-images")
    .getPublicUrl(path);

  return data.publicUrl;
}
async saveAuctionImage(
  auctionId: string,
  imageUrl: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER:", user?.id);
  console.log("AUCTION:", auctionId);
  console.log("URL:", imageUrl);

  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .select("id, seller_id")
    .eq("id", auctionId)
    .single();

  console.log("AUCTION DATA:", auction);

  if (auctionError) {
    throw new Error(auctionError.message);
  }

  const { data, error } = await supabase
    .from("auction_images")
    .insert({
      auction_id: auctionId,
      image_url: imageUrl,
    })
    .select();

  console.log("INSERT RESULT:", data);
  console.log("INSERT ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }
}
async deleteAuction(auctionId: string): Promise<void> {
  const supabase = await createClient();

  // =========================
  // Get Current User
  // =========================

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // =========================
  // Get Auction
  // =========================

  const { data: auction, error: auctionError } =
    await supabase
      .from("auctions")
      .select("id, seller_id, status")
      .eq("id", auctionId)
      .single();

  if (auctionError) {
    console.error(
      "GET AUCTION BEFORE DELETE ERROR:",
      auctionError
    );

    throw new Error(auctionError.message);
  }

  if (!auction) {
    throw new Error("المزاد غير موجود");
  }

  // =========================
  // Check Owner
  // =========================

  if (auction.seller_id !== user.id) {
    throw new Error(
      "ليس لديك صلاحية حذف هذا المزاد"
    );
  }

  // =========================
  // Check Sold
  // =========================

  if (auction.status === "sold") {
    throw new Error(
      "لا يمكن حذف المزاد بعد بيعه"
    );
  }

  // =========================
  // Get Images
  // =========================

  const { data: images, error: imagesError } =
    await supabase
      .from("auction_images")
      .select("image_url")
      .eq("auction_id", auctionId);

  if (imagesError) {
    throw new Error(imagesError.message);
  }

  // =========================
  // Delete Images From Storage
  // =========================

  if (images && images.length > 0) {
    const paths = images
      .map((image) => {
        const marker = "/auction-images/";

        const index =
          image.image_url.indexOf(marker);

        if (index === -1) {
          return null;
        }

        return decodeURIComponent(
          image.image_url.substring(
            index + marker.length
          )
        );
      })
      .filter(
        (path): path is string =>
          path !== null
      );

    if (paths.length > 0) {
      const {
        error: storageError,
      } = await supabase.storage
        .from("auction-images")
        .remove(paths);

      if (storageError) {
        console.error(
          "DELETE STORAGE IMAGES ERROR:",
          storageError
        );

        throw new Error(
          storageError.message
        );
      }
    }
  }

  // =========================
  // Delete Image Records
  // =========================

  const {
    error: deleteImagesError,
  } = await supabase
    .from("auction_images")
    .delete()
    .eq("auction_id", auctionId);

  if (deleteImagesError) {
    console.error(
      "DELETE AUCTION IMAGES ERROR:",
      deleteImagesError
    );

    throw new Error(
      deleteImagesError.message
    );
  }

  // =========================
  // Delete Auction
  // =========================

  const { error: deleteAuctionError } =
    await supabase
      .from("auctions")
      .delete()
      .eq("id", auctionId)
      .eq("seller_id", user.id);

  if (deleteAuctionError) {
    console.error(
      "SUPABASE DELETE AUCTION ERROR:",
      deleteAuctionError
    );

    throw new Error(
      deleteAuctionError.message
    );
  }
}

async getAllAuctions(): Promise<AuctionData[]> {
  const supabase = await createClient();

  const { data: auctions, error } = await supabase
    .from("auctions")
    .select(`
      id,
      seller_id,
      title,
      description,
      category,
      starting_price,
      current_price,
      status,
      auction_images!auction_images_auction_id_fkey (
        id,
        image_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE GET ALL AUCTIONS ERROR:", error);
    throw new Error(error.message);
  }

console.log(
  "RAW AUCTIONS:",
  JSON.stringify(auctions, null, 2)
);

  return (
    auctions?.map((auction) => ({
      id: auction.id,
      seller_id: auction.seller_id,
      title: auction.title,
      description: auction.description,
      category: auction.category,
      starting_price: auction.starting_price,
      current_price: auction.current_price,
      status: auction.status,

      images:
        auction.auction_images?.map(
          (image: { image_url: string }) => image.image_url
        ) ?? [],
    })) ?? []
  );
}

async getAuctionById(
  auctionId: string
): Promise<AuctionData | null> {

  const supabase = await createClient();

  const { data: auction, error } = await supabase
    .from("auctions")
    .select(`
      id,
      seller_id,
      winner_id,
      title,
      description,
      category,
      starting_price,
      current_price,
      status,

      auction_images (
        id,
        image_url
      )
    `)
    .eq("id", auctionId)
    .single();

  if (error) {

    if (error.code === "PGRST116") {
      return null;
    }

    console.error(
      "SUPABASE GET AUCTION BY ID ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return {
    id: auction.id,
    seller_id: auction.seller_id,
    Winner_id: auction.winner_id,
    title: auction.title,
    description: auction.description,
    category: auction.category,
    starting_price: auction.starting_price,
    current_price: auction.current_price,
    status: auction.status,

    images:
      auction.auction_images?.map(
        (image: { image_url: string }) => image.image_url
      ) ?? [],
  };
}
async AddBids(
  auctionId: string,
  bidAmount: number
): Promise<void> {

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .select("id, current_price, status")
    .eq("id", auctionId)
    .single();

  if (auctionError) {
    throw new Error(auctionError.message);
  }

  if (!auction) {
    throw new Error("Auction not found");
  }

  if (auction.status !== "active") {
    throw new Error("Auction is not active");
  }
  if (bidAmount <= Number(auction.current_price)) {
    throw new Error(
      `Bid must be greater than current price (${auction.current_price})`
    );
  }

  const { error: bidError } = await supabase
    .from("bids")
    .insert({
      auction_id: auctionId,
      bidder_id: user.id,
      amount: bidAmount,
    });

  if (bidError) {
    throw new Error(bidError.message);
  }
const { data: updatedAuction, error: updateError } = await supabase
  .from("auctions")
  .update({
    current_price: bidAmount,
  })
  .eq("id", auctionId)
  .select("id, current_price")
  .single();

if (updateError) {
  console.error("UPDATE AUCTION ERROR:", updateError);
  throw new Error(updateError.message);
}

console.log("UPDATED AUCTION:", updatedAuction);
}
async GetBids(auctionId: string): Promise<BidData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_bids_with_user_name",
    {
      p_auction_id: auctionId,
    }
  );

  if (error) {
    console.error("SUPABASE GET BIDS ERROR:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
async MyAuctions(): Promise<AuctionData[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("GET USER ERROR:", userError);
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  const { data: auctions, error: auctionError } = await supabase
    .from("auctions")
    .select(`
      id,
      seller_id,
      title,
      description,
      starting_price,
      current_price,
      status,
      created_at,
      category,
      winner_id,
      auction_images (
        id,
        image_url
      )
    `)
    .eq("winner_id", user.id)
    .eq("status", "ended")
    .order("created_at", { ascending: false });

  if (auctionError) {
    console.error(
      "SUPABASE MY UNPAID AUCTIONS ERROR:",
      auctionError
    );

    throw new Error(auctionError.message);
  }

  if (!auctions) {
    return [];
  }

  const unpaidAuctions: AuctionData[] = [];

  for (const auction of auctions) {
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id")
      .eq("auction_id", auction.id)
      .eq("payer_id", user.id)
      .eq("status", "paid")
      .maybeSingle();

    if (paymentError) {
      console.error(
        "PAYMENT CHECK ERROR:",
        paymentError
      );

      throw new Error(paymentError.message);
    }

    // لم يدفع
    if (!payment) {
      unpaidAuctions.push({
        ...auction,

        images:
          auction.auction_images?.map(
            (image: {
              id: string;
              image_url: string;
            }) => image.image_url
          ) ?? [],
      });
    }
  }

  return unpaidAuctions;
}
async finishAuction(auctionId: string): Promise<void> {
  const supabase = await createClient();

  // المستخدم الحالي
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // جلب المزاد
  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .select("id, seller_id, status")
    .eq("id", auctionId)
    .single();

  if (auctionError) {
    throw new Error(auctionError.message);
  }

  if (!auction) {
    throw new Error("Auction not found");
  }

  // التأكد أن المستخدم هو صاحب المزاد
  if (auction.seller_id !== user.id) {
    throw new Error("You are not the owner of this auction");
  }

  // المزاد يجب أن يكون active
  if (auction.status !== "active") {
    throw new Error("Only active auctions can be finished");
  }

  // جلب أعلى مزايدة
  const { data: highestBid, error: bidError } = await supabase
    .from("bids")
    .select("bidder_id, amount")
    .eq("auction_id", auctionId)
    .order("amount", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (bidError) {
    throw new Error(bidError.message);
  }

  // لا توجد مزايدات
  if (!highestBid) {
    const { error: updateError } = await supabase
      .from("auctions")
      .update({
        status: "ended",
        winner_id: null,
      })
      .eq("id", auctionId)
      .eq("seller_id", user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return;
  }

  // توجد مزايدة → تحديد صاحب أعلى مزايدة كفائز
  const { error: updateError } = await supabase
    .from("auctions")
    .update({
      status: "ended",
      winner_id: highestBid.bidder_id,
      current_price: highestBid.amount,
    })
    .eq("id", auctionId)
    .eq("seller_id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

async CheckOut(data: PaymentData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // التأكد أن المستخدم هو الفائز بالمزاد
  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .select("id, winner_id, status, current_price")
    .eq("id", data.auction_id)
    .single();

  if (auctionError) {
    console.error(
      "GET AUCTION ERROR:",
      auctionError
    );

    throw new Error(auctionError.message);
  }

  if (!auction) {
    throw new Error("Auction not found");
  }

  if (auction.winner_id !== user.id) {
    throw new Error("You are not the winner of this auction");
  }

  if (auction.status !== "ended") {
    throw new Error("Auction is not ended");
  }

  // التأكد أن المستخدم لم يدفع من قبل
  const { data: existingPayment, error: existingPaymentError } =
    await supabase
      .from("payments")
      .select("id")
      .eq("auction_id", data.auction_id)
      .eq("payer_id", user.id)
      .eq("status", "paid")
      .maybeSingle();

  if (existingPaymentError) {
    console.error(
      "CHECK EXISTING PAYMENT ERROR:",
      existingPaymentError
    );

    throw new Error(existingPaymentError.message);
  }

  if (existingPayment) {
    throw new Error("هذا المزاد تم دفعه بالفعل");
  }

  // إضافة عملية الدفع
  const { error: paymentError } = await supabase
    .from("payments")
    .insert({
      auction_id: data.auction_id,
      payer_id: user.id,
      amount: data.amount,
      card_number: data.card_number,
      expiry_date: data.expiry_date,
      cvv: data.cvv,
      status: "paid",
      paid_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error(
      "SUPABASE CHECKOUT ERROR:",
      paymentError
    );

    throw new Error(paymentError.message);
  }

  // تغيير حالة المزاد بعد نجاح الدفع
  const { error: updateAuctionError } = await supabase
    .from("auctions")
    .update({
      status: "sold",
    })
    .eq("id", data.auction_id)
    .eq("winner_id", user.id);

  if (updateAuctionError) {
    console.error(
      "UPDATE AUCTION STATUS ERROR:",
      updateAuctionError
    );

    throw new Error(updateAuctionError.message);
  }
}
async PaidAuction(
  userId: string
): Promise<AuctionData[]> {
  const supabase = await createClient();

  // 1. هات عمليات الدفع الخاصة بالمستخدم والتي تم دفعها
  const { data: payments, error: paymentError } =
    await supabase
      .from("payments")
      .select("auction_id")
      .eq("payer_id", userId)
      .eq("status", "paid");

  if (paymentError) {
    console.error(
      "SUPABASE PAID PAYMENTS ERROR:",
      paymentError
    );

    throw new Error(paymentError.message);
  }

  if (!payments || payments.length === 0) {
    return [];
  }

  // 2. استخراج IDs المزادات
  const auctionIds = payments.map(
    (payment) => payment.auction_id
  );

  // 3. هات المزادات المرتبطة بعمليات الدفع
  const { data: auctions, error: auctionError } =
    await supabase
      .from("auctions")
      .select(`
        id,
        seller_id,
        winner_id,
        title,
        description,
        category,
        starting_price,
        current_price,
        status,

        auction_images (
          image_url
        )
      `)
      .in("id", auctionIds)
      .order("created_at", {
        ascending: false,
      });

  if (auctionError) {
    console.error(
      "SUPABASE PAID AUCTIONS ERROR:",
      auctionError
    );

    throw new Error(auctionError.message);
  }

  // 4. تحويل البيانات إلى AuctionData
  return (auctions ?? []).map((auction) => ({
    id: auction.id,
    seller_id: auction.seller_id,
    winner_id: auction.winner_id,
    title: auction.title,
    description: auction.description,
    category: auction.category,
    starting_price: Number(auction.starting_price),
    current_price: Number(auction.current_price),
    status: auction.status,

    images:
      auction.auction_images?.map(
        (image) => image.image_url
      ) ?? [],
  }));
}
async MyAuction_unpaid(): Promise<AuctionData[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  const { data: auctions, error: auctionError } = await supabase
    .from("auctions")
    .select(`
      id,
      seller_id,
      title,
      description,
      starting_price,
      current_price,
      status,
      created_at,
      category,
      winner_id,
      auction_images (
        id,
        image_url
      )
    `)
    .eq("seller_id", user.id)
    .eq("status", "ended")
    .not("winner_id", "is", null)
    .order("created_at", { ascending: false });

  if (auctionError) {
    console.error(
      "MyAuction_unpaid auction error:",
      auctionError
    );

    throw new Error(auctionError.message);
  }

  if (!auctions) {
    return [];
  }

  const unpaidAuctions: AuctionData[] = [];

  for (const auction of auctions) {
    if (!auction.winner_id) {
      continue;
    }

    const { data: payment, error: paymentError } =
      await supabase
        .from("payments")
        .select("id, payer_id, status")
        .eq("auction_id", auction.id)
        .eq("payer_id", auction.winner_id)
        .eq("status", "paid")
        .maybeSingle();

    if (paymentError) {
      console.error(
        "MyAuction_unpaid payment error:",
        paymentError
      );

      throw new Error(paymentError.message);
    }

    // لو لم يوجد دفع PAID من الفائز
    if (!payment) {
      unpaidAuctions.push({
        ...auction,

        images:
          auction.auction_images?.map(
            (image: {
              id: string;
              image_url: string;
            }) => image.image_url
          ) ?? [],
      });
    }
  }

  return unpaidAuctions;
}
async MyAuction_paid(): Promise<AuctionData[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  const { data: auctions, error } = await supabase
    .from("auctions")
    .select(`
      id,
      seller_id,
      title,
      description,
      starting_price,
      current_price,
      status,
      created_at,
      category,
      winner_id,
      auction_images (
        id,
        image_url
      )
    `)
    .eq("seller_id", user.id)
    .eq("status", "sold")
    .not("winner_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("MyAuction_paid error:", error);
    throw new Error(error.message);
  }

  if (!auctions) {
    return [];
  }

  return auctions.map((auction) => ({
    ...auction,
    images:
      auction.auction_images?.map(
        (image: {
          id: string;
          image_url: string;
        }) => image.image_url
      ) ?? [],
  }));
}
}