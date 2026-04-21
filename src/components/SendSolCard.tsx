"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useState } from "react";

export default function SendSolCard() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  if (!publicKey) return null;

 const handleSend = async () => {
  try {
    setLoading(true);

    if (!publicKey) throw new Error("Wallet not connected");

    if (!to || !amount) {
      alert("Enter address and amount");
      return;
    }

    let receiver: PublicKey;

    try {
      receiver = new PublicKey(to);
    } catch {
      alert("Invalid address");
      return;
    }

    const sol = Number(amount);

    if (isNaN(sol) || sol <= 0) {
      alert("Invalid amount");
      return;
    }

    const lamports = Math.floor(sol * LAMPORTS_PER_SOL);

    // ✅ CHECK BALANCE
    const balance = await connection.getBalance(publicKey);
    if (balance < lamports) {
      alert("Insufficient balance");
      return;
    }

    // ✅ GET LATEST BLOCKHASH
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: publicKey,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: receiver,
        lamports,
      })
    );

    // ✅ SEND TX
    const signature = await sendTransaction(transaction, connection);

    // ✅ CONFIRM PROPERLY
    await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed"
    );

    setSignature(signature);
    setTo("");
    setAmount("");

  } catch (err: any) {
    console.error("Send error:", err);

    // Better error messages 👇
    if (err.message?.includes("User rejected")) {
      alert("Transaction rejected");
    } else {
      alert(err.message || "Transaction failed");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="card">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-2xl shadow-black/40 w-full max-w-md">

        {/* HEADER */}
        <h3 className="text-white text-lg font-semibold mb-4">
          Send SOL
        </h3>

        {/* INPUT ADDRESS */}
        <input
          type="text"
          placeholder="Recipient Address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm outline-none focus:border-white"
        />

        {/* INPUT AMOUNT */}
        <input
          type="number"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm outline-none focus:border-white"
        />

        {/* BUTTON */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send SOL"}
        </button>

        {/* SUCCESS */}
        {signature && (
          <p className="text-green-400 text-xs mt-3 break-all">
            Tx: {signature.slice(0, 10)}...
          </p>
        )}
      </div>
    </div>
  );
}