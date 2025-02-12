"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import SolanaWallet from "./SolanaWallet";
import Button from "../Button/Button";

// Extend the Window type to avoid TypeScript errors for unisat
declare global {
    interface Window {
        unisat?: {
            getAccounts: () => Promise<string[]>;
        };
    }
}

export default function WalletConnector() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    // EVM wallet balance with refetch function
    const { data: evmBalance, refetch: refetchBalance } = useBalance({
        address: address,
    });

    // Periodically refetch the EVM wallet balance every 30 seconds
    useEffect(() => {
        if (isConnected) {
            const interval = setInterval(() => {
                refetchBalance();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [isConnected, refetchBalance]);

    const [bitcoinWallet, setBitcoinWallet] = useState<string | null>(null);
    const [bitcoinBalance, setBitcoinBalance] = useState<number | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const connectEVM = (connector: any) => connect({ connector });

    const connectBitcoin = async () => {
        try {
            if (window.unisat && window.unisat.getAccounts) {
                const accounts: string[] = await window.unisat.getAccounts();
                setBitcoinWallet(accounts[0]);
            } else {
                alert("Unisat Wallet not installed");
            }
        } catch (error) {
            console.error("Bitcoin connection error:", error);
        }
    };

    // Fetch Bitcoin balance when the Bitcoin wallet is connected, because Unisat doesn't provide balance it
    useEffect(() => {
        if (bitcoinWallet) {
            const fetchBitcoinBalance = async () => {
                try {
                    const response = await fetch(
                        `https://blockstream.info/api/address/${bitcoinWallet}`
                    );
                    const data = await response.json();
                    const { chain_stats } = data;
                    const balanceSats =
                        chain_stats.funded_txo_sum - chain_stats.spent_txo_sum;
                    const balanceBtc = balanceSats / 1e8;
                    setBitcoinBalance(balanceBtc);
                } catch (error) {
                    console.error("Error fetching Bitcoin balance:", error);
                }
            };
            fetchBitcoinBalance();
            const interval = setInterval(fetchBitcoinBalance, 30000);
            return () => clearInterval(interval);
        } else {
            setBitcoinBalance(null);
        }
    }, [bitcoinWallet]);

    if (!isClient) return null;
    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg w-full mx-4 p-6 bg-gray-950 border border-gray-800 text-white shadow-2xl rounded-xl space-y-6">
                <h2 className="text-3xl font-extrabold text-center border-b border-gray-800 pb-3">
                    Wallet Connector
                </h2>

                {/* EVM Wallet */}
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">EVM Wallet</h3>
                    {isConnected ? (
                        <div className="mt-2 space-y-3">
                            <p className="text-gray-300 break-words">
                                Connected: {address}
                            </p>
                            {evmBalance && (
                                <p className="text-gray-300">
                                    Balance: {evmBalance.formatted}{" "}
                                    {evmBalance.symbol}
                                </p>
                            )}
                            <Button
                                onClick={() => disconnect()}
                                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-md"
                            >
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-2 space-y-3">
                            {connectors.map((connector) => (
                                <Button
                                    key={connector.id}
                                    onClick={() => connectEVM(connector)}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-md"
                                >
                                    Connect {connector.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Solana Wallet */}
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                        Solana Wallet
                    </h3>
                    <SolanaWallet />
                </div>

                {/* Bitcoin Wallet */}
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                        Bitcoin Wallet
                    </h3>
                    {bitcoinWallet ? (
                        <div className="mt-2 space-y-3">
                            <p className="text-gray-300 break-words">
                                Connected: {bitcoinWallet}
                            </p>
                            {bitcoinBalance !== null && (
                                <p className="text-gray-300">
                                    Balance: {bitcoinBalance.toFixed(8)} BTC
                                </p>
                            )}
                            <Button
                                onClick={() => setBitcoinWallet(null)}
                                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-md"
                            >
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={connectBitcoin}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-md"
                        >
                            Connect Unisat
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
