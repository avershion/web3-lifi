"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
    ConnectionProvider,
    WalletProvider,
    useWallet,
    useConnection,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
    UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletUI = () => {
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection();
    const [solBalance, setSolBalance] = useState<number | null>(null);

    useEffect(() => {
        if (connected && publicKey) {
            const fetchSolBalance = async () => {
                try {
                    const balance = await connection.getBalance(publicKey);
                    setSolBalance(balance / LAMPORTS_PER_SOL);
                } catch (error) {
                    console.error("Error fetching SOL balance:", error);
                }
            };
            fetchSolBalance();
            const interval = setInterval(fetchSolBalance, 30000);
            return () => clearInterval(interval);
        } else {
            setSolBalance(null);
        }
    }, [connected, publicKey, connection]);

    return (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
            <div className="flex flex-col space-y-3">
                <WalletMultiButton className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-md text-white" />
                <WalletDisconnectButton className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-md text-white" />
                {connected && publicKey && (
                    <p className="text-gray-300 break-words">
                        Balance:{" "}
                        {solBalance !== null
                            ? solBalance.toFixed(2)
                            : "Loading..."}{" "}
                        SOL
                    </p>
                )}
            </div>
        </div>
    );
};

export default function SolanaWallet() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new UnsafeBurnerWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletUI />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
