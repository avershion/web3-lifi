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
import { isTokenArrayEqual } from "../../helpers/helpers";

export type Token = {
    address: string;
    balance: string;
    symbol: string;
};

interface WalletUIProps {
    setCurrentTokens: (tokens: Token[]) => void;
    currentTokens: Token[];
}

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

    return (
        <Button
            onClick={handleClick}
            variant={connected ? "danger" : "primary"}
        >
            {buttonText}
        </Button>
    );
};

const WalletUI = ({ setCurrentTokens, currentTokens }: WalletUIProps) => {
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection();
    const [solBalance, setSolBalance] = useState<number | null>(null);

    // Update SOL in the tokens array only when needed
    useEffect(() => {
        const filteredTokens = currentTokens.filter(
            (token) => token.symbol !== "SOL"
        );

        const newSolToken =
            connected && publicKey && solBalance !== null
                ? {
                      address: publicKey.toBase58(),
                      balance: solBalance.toString(),
                      symbol: "SOL",
                  }
                : null;

        const newTokens = newSolToken
            ? [...filteredTokens, newSolToken]
            : filteredTokens;

        // Only update if the tokens array actually changed
        if (!isTokenArrayEqual(newTokens, currentTokens)) {
            setCurrentTokens(newTokens);
        }
    }, [connected, publicKey, solBalance, currentTokens, setCurrentTokens]);

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
                <SolanaButton />
            </div>
        </div>
    );
};

interface SolanaWalletProps {
    setCurrentTokens: (tokens: Token[]) => void;
    currentTokens: Token[];
}

export default function SolanaWallet({
    setCurrentTokens,
    currentTokens,
}: SolanaWalletProps) {
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
                    <WalletUI
                        setCurrentTokens={setCurrentTokens}
                        currentTokens={currentTokens}
                    />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
