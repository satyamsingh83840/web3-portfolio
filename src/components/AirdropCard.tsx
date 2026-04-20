"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

/* ---------------- TYPES ---------------- */
type AirdropCardProps = {
  network: "devnet" | "mainnet" | "testnet";
};

/* ---------------- COMPONENT ---------------- */
export default function AirdropCard({ network }: AirdropCardProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  // Hide if not devnet or no wallet
  if (network !== "devnet" || !publicKey) return null;

  const requestAirdrop = async () => {
    try {
      setLoading(true);

      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(signature, "confirmed");

      alert("✅ Airdrop successful!");
    } catch (err) {
      console.error("Airdrop error:", err);
      alert("❌ Airdrop failed (try again)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-2">
        Devnet Airdrop
      </h3>

      <p className="text-zinc-400 text-sm mb-4">
        Get free SOL for testing on Devnet.
      </p>

      <button
        onClick={requestAirdrop}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-white text-black font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Requesting..." : "Airdrop 1 SOL"}
      </button>
    </div>
  );
}