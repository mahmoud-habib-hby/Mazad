"use client";

import { useState } from "react";
import { UseCreateAuction } from "../hooks/UseCreateAuction";

export default function CreateAuctionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const createAuction = UseCreateAuction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAuction.mutate({
      title,
      description,
      image_url: imageUrl,
      starting_price: Number(startingPrice),
      current_price:0,
      status: startTime > new Date().toISOString() ? "not_ready" : "active",
      start_time: startTime,
      end_time: endTime,
    });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            إنشاء مزاد
          </h1>

          <p className="mt-2 text-gray-500">
            أضف تفاصيل المنتج وحدد موعد بداية ونهاية المزاد
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                اسم المنتج
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: iPhone 15 Pro Max"
                required
                disabled={createAuction.isPending}
                className="w-full rounded-xl border border-gray-300
                px-4 py-3 text-gray-900 outline-none transition
                placeholder:text-gray-400
                focus:border-green-500 focus:ring-2 focus:ring-green-100
                disabled:bg-gray-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                وصف المنتج
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفًا للمنتج..."
                rows={4}
                disabled={createAuction.isPending}
                className="w-full resize-none rounded-xl border border-gray-300
                px-4 py-3 text-gray-900 outline-none transition
                placeholder:text-gray-400
                focus:border-green-500 focus:ring-2 focus:ring-green-100
                disabled:bg-gray-100"
              />
            </div>

            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رابط الصورة
              </label>

              <input
                id="image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={createAuction.isPending}
                className="w-full rounded-xl border border-gray-300
                px-4 py-3 text-gray-900 outline-none transition
                placeholder:text-gray-400
                focus:border-green-500 focus:ring-2 focus:ring-green-100
                disabled:bg-gray-100"
              />
            </div>

            {/* Starting Price */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                السعر الابتدائي
              </label>

              <div className="relative">
                <input
                  id="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={createAuction.isPending}
                  className="w-full rounded-xl border border-gray-300
                  px-4 py-3 text-gray-900 outline-none transition
                  placeholder:text-gray-400
                  focus:border-green-500 focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-100"
                />

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  جنيه
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Start */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  بداية المزاد
                </label>

                <input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  disabled={createAuction.isPending}
                  className="w-full rounded-xl border border-gray-300
                  px-4 py-3 text-gray-900 outline-none transition
                  focus:border-green-500 focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-100"
                />
              </div>

              {/* End */}
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  نهاية المزاد
                </label>

                <input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  disabled={createAuction.isPending}
                  className="w-full rounded-xl border border-gray-300
                  px-4 py-3 text-gray-900 outline-none transition
                  focus:border-green-500 focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-100"
                />
              </div>

            </div>

            {/* Error */}
            {createAuction.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {createAuction.error instanceof Error
                    ? createAuction.error.message
                    : "حدث خطأ أثناء إنشاء المزاد"}
                </p>
              </div>
            )}

            {/* Success */}
            {createAuction.isSuccess && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm text-green-700">
                  تم إنشاء المزاد بنجاح
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={createAuction.isPending}
              className="w-full rounded-xl bg-green-600 py-3.5
              font-semibold text-white transition
              hover:bg-green-700
              focus:outline-none focus:ring-2 focus:ring-green-500
              focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createAuction.isPending
                ? "جاري إنشاء المزاد..."
                : "إنشاء المزاد"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}