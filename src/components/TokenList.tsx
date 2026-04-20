"use client";

import FadeIn from "./ui/FadeIn";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

/* ---------------- TYPES ---------------- */
type Token = {
  mint: string;
  balance: number;
};

/* ---------------- COMPONENT ---------------- */
export default function TokenList() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    const fetchTokens = async () => {
      setLoading(true);

      try {
        const accounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          }
        );

        const list: Token[] = accounts.value
          .map((item) => {
            const info = item.account.data.parsed?.info;

            if (!info) return null;

            return {
              mint: info.mint as string,
              balance: info.tokenAmount.uiAmount as number,
            };
          })
          .filter(
            (t): t is Token => t !== null && t.balance > 0
          );

        setTokens(list);
      } catch (err) {
        console.error("Token fetch error:", err);
      } finally {
        setLoading(false);
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

          {/* Loading */}
          {loading && (
            <p className="text-zinc-400 text-sm animate-pulse">
              Fetching tokens...
            </p>
          )}

          {/* Empty */}
          {!loading && tokens.length === 0 && (
            <p className="text-zinc-400 text-sm">No tokens found</p>
          )}

          {/* Token List */}
          {!loading && tokens.length > 0 && (
            <div className="space-y-3">
              {tokens.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-zinc-800 px-4 py-3 rounded-xl hover:bg-zinc-700 transition"
                >
                  <span className="text-zinc-300 text-sm font-mono">
                    {t.mint.slice(0, 4)}...{t.mint.slice(-4)}
                  </span>

                  <span className="text-white text-sm font-semibold">
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