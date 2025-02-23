"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { TokenType } from "../TokenList/types";
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

export default function WalletConnector({
    setCurrentTokens,
    currentTokens,
}: {
    setCurrentTokens: (tokens: TokenType[]) => void;
    currentTokens: TokenType[];
}) {
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

    // Fetch Bitcoin balance when the Bitcoin wallet is connected, because Unisat doesn't provide balance
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

    // Combine wallet data into an array of token objects
    useEffect(() => {
        const tokens: { address: string; balance: string; symbol: string }[] =
            [];

        if (isConnected && evmBalance && address) {
            tokens.push({
                address,
                balance: evmBalance.formatted,
                symbol: evmBalance.symbol,
            });
        }

        if (bitcoinWallet && bitcoinBalance !== null) {
            tokens.push({
                address: bitcoinWallet,
                balance: bitcoinBalance.toFixed(8),
                symbol: "BTC",
            });
        }

        setCurrentTokens(tokens);
    }, [
        isConnected,
        evmBalance,
        bitcoinWallet,
        bitcoinBalance,
        address,
        setCurrentTokens,
    ]);

    if (!isClient) return null;
    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg w-full mx-4 p-6 bg-transparent text-white shadow-lg rounded-xl">
                {/* Header: Hidden on mobile and medium, shown on large devices */}
                <h2 className="hidden lg:block w-[400px] text-center text-3xl font-extrabold pb-3">
                    Wallet Connector
                </h2>

                {/* Wallet cards container: row view by default (mobile & medium), column on large */}
                <div className="flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-6">
                    {/* Solana Wallet */}
                    <div className="p-4 bg-gray-800 rounded-lg shadow-sm flex-1">
                        <h3 className="text-xl font-semibold mb-2">Solana</h3>
                        <SolanaWallet
                            setCurrentTokens={setCurrentTokens}
                            currentTokens={currentTokens}
                        />
                    </div>

                    {/* EVM Wallet */}
                    <div className="p-4 bg-gray-800 rounded-lg shadow-sm flex-1">
                        <h3 className="text-xl font-semibold mb-2">EVM</h3>
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
                                    variant="danger"
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
                                        variant="primary"
                                    >
                                        Connect {connector.name}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bitcoin Wallet */}
                    <div className="p-4 bg-gray-800 rounded-lg shadow-sm flex-1">
                        <h3 className="text-xl font-semibold mb-2">Bitcoin</h3>
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
                                    variant="danger"
                                >
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={connectBitcoin} variant="primary">
                                Connect Unisat
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
