"use client";

import { useMutation } from "@tanstack/react-query";
import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { CheckOutUseCase } from "../../domain/UseCase/CheckOut";
import { PaymentData } from "../../domain/entity/PaymentData";



const auctionRepository = new SupabaseAuctionRepository();
const CheckOut = new CheckOutUseCase(auctionRepository);
export function useCheckOut() {
  return useMutation({
    mutationFn: (data: PaymentData) => CheckOut.execute(data),
  });
}