"use client";

import FadeIn from "./ui/FadeIn";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export default function WalletCard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    const getBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error("Balance error:", err);
      }
    };

    getBalance();
  }, [publicKey, connection]);

  const shorten = (key: PublicKey | null) =>
    key
      ? key.toBase58().slice(0, 4) +
        "..." +
        key.toBase58().slice(-4)
      : "";

  const copy = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58());
  };

  if (!connected) return null;

  return (
    <FadeIn delay={0.1}>
      <div className="card">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl shadow-black/40 w-full max-w-md">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Wallet</h3>
            <span className="text-xs text-green-400">Connected</span>
          </div>

          {/* ADDRESS */}
          <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 rounded-lg mb-4">
            <span className="text-zinc-300 text-sm">
              {shorten(publicKey)}
            </span>

            <button
              onClick={copy}
              className="text-xs text-zinc-400 hover:text-white transition"
            >
              Copy
            </button>
          </div>

          {/* BALANCE */}
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 text-sm">Balance</span>

            <span className="text-white font-semibold text-lg">
              {balance !== null
                ? `${balance.toFixed(2)} SOL`
                : "Loading..."}
            </span>
          </div>

        </div>
      </div>
    </FadeIn>
  );
}