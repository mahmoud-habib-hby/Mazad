"use client";

import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";
import { MyAuctionPaidUseCase } from "../../domain/UseCase/MyAuction_unpaid";

const auctionRepository = new SupabaseAuctionRepository();

const myAuctionPaid = new MyAuctionPaidUseCase(auctionRepository);

export function UseMyAuctionPaid() {
  return useMutation({
    mutationFn: () => myAuctionPaid.execute(),
  });
}