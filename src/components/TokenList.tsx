"use client";

import FadeIn from "./ui/FadeIn";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

export default function TokenList() {
  const { publicKey } = useWallet();
  const { connection } = useConnection(); // ✅ correct
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (!publicKey) return;

    const fetchTokens = async () => {
      try {
        const accounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          }
        );

        const list = accounts.value
          .map((item) => {
            const info = item.account.data.parsed.info;
            return {
              mint: info.mint,
              balance: info.tokenAmount.uiAmount,
            };
          })
          .filter((t) => t.balance > 0);

        setTokens(list);
      } catch (err) {
        console.error("Token fetch error:", err);
      }
    };

    fetchTokens();
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <FadeIn delay={0.1}>
      <div className="card">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl shadow-black/40">
          <h3 className="text-white font-semibold mb-4">Tokens</h3>

          {tokens.length === 0 ? (
            <p className="text-zinc-400 text-sm">No tokens found</p>
          ) : (
            <div className="space-y-3">
              {tokens.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-zinc-800 px-4 py-2 rounded-lg"
                >
                  <span className="text-zinc-300 text-sm">
                    {t.mint.slice(0, 4)}...{t.mint.slice(-4)}
                  </span>
                  <span className="text-white text-sm font-medium">
                    {t.balance}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}