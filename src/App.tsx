"use client";

import { useMemo, useState } from "react";

import WalletCard from "./components/Walletcard";
import TokenList from "./components/TokenList";
import AirdropCard from "./components/AirdropCard";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const [network, setNetwork] = useState<"devnet" | "mainnet">("devnet");

  const devnet =
    import.meta.env.VITE_DEVNET_RPC || "https://api.devnet.solana.com";

  const mainnet =
    import.meta.env.VITE_MAINNET_RPC ||
    "https://api.mainnet-beta.solana.com";

  const endpoint = network === "devnet" ? devnet : mainnet;

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>

          {/* 🌌 PREMIUM BACKGROUND */}
          <div className="fixed inset-0 -z-10 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_60%)]" />
          </div>

          {/* 🔥 NAVBAR */}
          <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

              {/* LOGO */}
              <h1 className="text-xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ⚡ Satyam.dev
                </span>
              </h1>

              {/* RIGHT */}
              <div className="flex items-center gap-4">

                {/* NETWORK SWITCH */}
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md">
                  {["devnet", "mainnet"].map((net) => (
                    <button
                      key={net}
                      onClick={() => setNetwork(net as any)}
                      className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                        network === net
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>

                {/* WALLET BUTTON */}
                <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-blue-500 hover:!opacity-90 !border-0 !rounded-xl !px-5 !py-2.5 !text-sm !font-medium !shadow-lg !shadow-purple-500/20 transition-all duration-300" />
              </div>
            </div>
          </header>

          {/* 🧠 MAIN */}
          <main className="pt-32 px-6 max-w-7xl mx-auto text-zinc-200">

            {/* TITLE */}
            <div className="mb-10">
              <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-zinc-500 mt-2">
                Manage your Solana assets with style ⚡
              </p>
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-3 gap-8">

              {/* LEFT */}
              <div className="space-y-6">
                <div className="glass-card">
                  <WalletCard />
                </div>

                <div className="glass-card">
                  <AirdropCard network={network} />
                </div>
              </div>

              {/* RIGHT */}
              <div className="md:col-span-2 space-y-6">
                <div className="glass-card">
                  <TokenList />
                </div>
              </div>

            </div>
          </main>

        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;