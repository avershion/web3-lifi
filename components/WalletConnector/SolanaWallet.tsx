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
    useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import Button from "../Button/Button";

const SolanaButton = () => {
    const { wallet, connected, connect, disconnect, publicKey } = useWallet();
    // Use the wallet modal hook to open the wallet selection modal
    const { setVisible } = useWalletModal();

    const handleClick = async () => {
        // If no wallet is selected, open the modal to let the user choose one
        if (!wallet) {
            setVisible(true);
            return;
        }

        if (connected) {
            await disconnect();
        } else {
            await connect();
        }
    };

    let buttonText = "";
    if (connected && publicKey) {
        buttonText = `Disconnect (${publicKey
            .toBase58()
            .slice(0, 4)}...${publicKey.toBase58().slice(-4)})`;
    } else {
        buttonText = "Connect Solana";
    }

    return <Button onClick={handleClick}>{buttonText}</Button>;
};

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
        <div className="bg-gray-800 rounded-lg">
            <div className="flex flex-col space-y-3">
                {connected && publicKey && (
                    <p className="text-gray-300 break-words">
                        Balance:{" "}
                        {solBalance !== null
                            ? solBalance.toFixed(2)
                            : "Loading..."}{" "}
                        SOL
                    </p>
                )}
                {/* Use the custom wallet button instead of WalletMultiButton */}
                <SolanaButton />
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
