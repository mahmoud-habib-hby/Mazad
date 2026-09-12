"use client";

import { useMutation } from "@tanstack/react-query";

import { SupabaseAuctionRepository } from "../../data/AuctionImpl";

import { MyAuctionUnPaidUseCase } from "../../domain/UseCase/MyAuction_paid";

const auctionRepository = new SupabaseAuctionRepository();

const myAuctionUnPaid = new MyAuctionUnPaidUseCase(auctionRepository);

export function UseMyAuctionUnPaid() {
  return useMutation({
    mutationFn: () => myAuctionUnPaid.execute(),
  });
}