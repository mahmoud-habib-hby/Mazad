"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCheckOut } from "../../hooks/useCheckOut";
import { useGetAuctionById } from "../../hooks/useActionById";
import { UseThemStor } from "@/stor/themStor";

export default function CheckOutPage() {
  const params = useParams();

  const auctionId = params.id as string;
const route=useRouter();
  const getAuction = useGetAuctionById();
  const checkOut = useCheckOut();

  const isDark = UseThemStor((state) => state.isDark);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (auctionId) {
      getAuction.mutate(auctionId);
    }
  }, [auctionId]);

  const auction = getAuction.data;

  const handleCheckout = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!auction) return;

    try {
      await checkOut.mutateAsync({
        id: crypto.randomUUID(),
        auction_id: auction.id,
        payer_id: "",
        amount: auction.current_price,
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv: cvv,
        status: "pending",
        created_at: new Date().toISOString(),
        paid_at: null,
      });

      alert("تم الدفع بنجاح");

      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      route.push("/my-purchases/unpaid");
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء الدفع"
      );
    }
  };

  if (getAuction.isPending) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDark
            ? "bg-[#050706] text-[#E8EEE9]"
            : "bg-[#f5efe6] text-[#3d342c]"
        }`}
      >
        <p className="text-lg font-medium">
          جاري تحميل المزاد...
        </p>
      </div>
    );
  }

  if (getAuction.isError) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDark
            ? "bg-[#050706] text-[#E8EEE9]"
            : "bg-[#f5efe6] text-[#3d342c]"
        }`}
      >
        <p className="text-lg font-medium">
          حدث خطأ أثناء تحميل المزاد
        </p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDark
            ? "bg-[#050706] text-[#E8EEE9]"
            : "bg-[#f5efe6] text-[#3d342c]"
        }`}
      >
        <p className="text-lg font-medium">
          المزاد غير موجود
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark
          ? "bg-[#050706] text-[#E8EEE9]"
          : "bg-[#f5efe6] text-[#3d342c]"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`border rounded-2xl p-6 shadow-sm transition-colors duration-300 ${
            isDark
              ? "bg-[#111714] border-[#26382D]"
              : "bg-[#fffaf3] border-[#e5d8c8]"
          }`}
        >
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-[#E8EEE9]" : "text-[#3d342c]"
            }`}
          >
            {auction.title}
          </h1>

          <p
            className={`mb-6 leading-relaxed ${
              isDark ? "text-[#91A198]" : "text-[#7b6d5f]"
            }`}
          >
            {auction.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-[#151C18] border-[#26382D]"
                  : "bg-[#faf5ee] border-[#eadfd2]"
              }`}
            >
              <p
                className={`text-sm mb-1 ${
                  isDark ? "text-[#68776E]" : "text-[#9a8978]"
                }`}
              >
                القسم
              </p>

              <p
                className={`font-semibold ${
                  isDark ? "text-[#E8EEE9]" : "text-[#3d342c]"
                }`}
              >
                {auction.category}
              </p>
            </div>

            <div
              className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-[#151C18] border-[#26382D]"
                  : "bg-[#faf5ee] border-[#eadfd2]"
              }`}
            >
              <p
                className={`text-sm mb-1 ${
                  isDark ? "text-[#68776E]" : "text-[#9a8978]"
                }`}
              >
                الحالة
              </p>

              <p
                className={`font-semibold ${
                  isDark ? "text-[#E8EEE9]" : "text-[#3d342c]"
                }`}
              >
                {auction.status}
              </p>
            </div>

            <div
              className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-[#151C18] border-[#26382D]"
                  : "bg-[#faf5ee] border-[#eadfd2]"
              }`}
            >
              <p
                className={`text-sm mb-1 ${
                  isDark ? "text-[#68776E]" : "text-[#9a8978]"
                }`}
              >
                سعر البداية
              </p>

              <p
                className={`font-semibold ${
                  isDark ? "text-[#E8EEE9]" : "text-[#3d342c]"
                }`}
              >
                {auction.starting_price}
              </p>
            </div>

            <div
              className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-[#151C18] border-[#26382D]"
                  : "bg-[#faf5ee] border-[#eadfd2]"
              }`}
            >
              <p
                className={`text-sm mb-1 ${
                  isDark ? "text-[#68776E]" : "text-[#9a8978]"
                }`}
              >
                السعر النهائي
              </p>

              <p
                className={`font-bold text-xl ${
                  isDark ? "text-[#73B88A]" : "text-[#6b4f3a]"
                }`}
              >
                {auction.current_price}
              </p>
            </div>
          </div>

          {auction.images.length > 0 && (
            <div className="mt-7">
              <h2 className="text-lg font-semibold mb-4">
                صور المزاد
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {auction.images.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={auction.title}
                    className={`w-full h-40 object-cover rounded-xl border ${
                      isDark
                        ? "border-[#26382D]"
                        : "border-[#e5d8c8]"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {auction.status === "ended" && auction.Winner_id && (
          <div
            className={`border rounded-2xl p-6 mt-6 shadow-sm transition-colors duration-300 ${
              isDark
                ? "bg-[#111714] border-[#26382D]"
                : "bg-[#fffaf3] border-[#e5d8c8]"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-[#E8EEE9]" : "text-[#3d342c]"
              }`}
            >
              إتمام الدفع
            </h2>

            <p
              className={`mb-1 ${
                isDark ? "text-[#91A198]" : "text-[#8b7a6a]"
              }`}
            >
              المبلغ المطلوب
            </p>

            <p
              className={`text-3xl font-bold mb-7 ${
                isDark ? "text-[#73B88A]" : "text-[#6b4f3a]"
              }`}
            >
              {auction.current_price}
            </p>

            <form
              onSubmit={handleCheckout}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="cardNumber"
                  className={`block mb-2 font-medium ${
                    isDark ? "text-[#D8E0DB]" : "text-[#4b3c31]"
                  }`}
                >
                  رقم البطاقة
                </label>

                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                  className={`w-full border rounded-xl p-3 outline-none transition ${
                    isDark
                      ? "bg-[#151C18] border-[#26382D] text-[#E8EEE9] placeholder:text-[#68776E] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                      : "bg-[#faf5ee] border-[#ddcdbc] text-[#3d342c] placeholder:text-[#b3a293] focus:border-[#9a7658] focus:ring-2 focus:ring-[#e8d9c9]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className={`block mb-2 font-medium ${
                      isDark
                        ? "text-[#D8E0DB]"
                        : "text-[#4b3c31]"
                    }`}
                  >
                    تاريخ الانتهاء
                  </label>

                  <input
                    id="expiryDate"
                    type="text"
                    inputMode="numeric"
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(e.target.value)
                    }
                    placeholder="12/28"
                    maxLength={5}
                    required
                    className={`w-full border rounded-xl p-3 outline-none transition ${
                      isDark
                        ? "bg-[#151C18] border-[#26382D] text-[#E8EEE9] placeholder:text-[#68776E] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                        : "bg-[#faf5ee] border-[#ddcdbc] text-[#3d342c] placeholder:text-[#b3a293] focus:border-[#9a7658] focus:ring-2 focus:ring-[#e8d9c9]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className={`block mb-2 font-medium ${
                      isDark
                        ? "text-[#D8E0DB]"
                        : "text-[#4b3c31]"
                    }`}
                  >
                    CVV
                  </label>

                  <input
                    id="cvv"
                    type="password"
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    required
                    className={`w-full border rounded-xl p-3 outline-none transition ${
                      isDark
                        ? "bg-[#151C18] border-[#26382D] text-[#E8EEE9] placeholder:text-[#68776E] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                        : "bg-[#faf5ee] border-[#ddcdbc] text-[#3d342c] placeholder:text-[#b3a293] focus:border-[#9a7658] focus:ring-2 focus:ring-[#e8d9c9]"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={checkOut.isPending}
                className={`w-full text-white rounded-xl p-3.5 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-[#315C45] hover:bg-[#264B38]"
                    : "bg-[#6b4f3a] hover:bg-[#5a4030]"
                }`}
              >
                {checkOut.isPending
                  ? "جاري الدفع..."
                  : `دفع ${auction.current_price}`}
              </button>
            </form>
          </div>
        )}

        {auction.status !== "ended" && (
          <div
            className={`border rounded-2xl p-6 mt-6 text-center ${
              isDark
                ? "bg-[#111714] border-[#26382D]"
                : "bg-[#fffaf3] border-[#e5d8c8]"
            }`}
          >
            <p
              className={
                isDark ? "text-[#91A198]" : "text-[#7b6d5f]"
              }
            >
              لا يمكن الدفع الآن، المزاد لم ينتهِ بعد.
            </p>
          </div>
        )}

        {auction.status === "ended" && !auction.Winner_id && (
          <div
            className={`border rounded-2xl p-6 mt-6 text-center ${
              isDark
                ? "bg-[#111714] border-[#26382D]"
                : "bg-[#fffaf3] border-[#e5d8c8]"
            }`}
          >
            <p
              className={
                isDark ? "text-[#91A198]" : "text-[#7b6d5f]"
              }
            >
              انتهى المزاد بدون وجود فائز.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
