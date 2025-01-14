"use client";
import { fetchTransactions } from "@/actions/fetch/fetch";
import { useEffect } from "react";

export default function LandingPageComponent() {
  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await fetchTransactions();
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    }

    loadTransactions();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      hello
    </div>
  );
}
