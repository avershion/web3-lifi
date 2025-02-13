"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { TokenType } from "./types";

type Token = {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    priceUSD: string;
    coinKey: string;
    logoURI: string;
};

interface TokensResponse {
    tokens: {
        [chainId: string]: Token[];
    };
}

// Token Logo Fallback
const TokenLogo = ({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return <img src="/vercel.svg" alt="Icon" className={className} />;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
};

export default function TokenList({
    currentTokens,
}: {
    currentTokens: TokenType[];
}) {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await fetch("https://li.quest/v1/tokens");
                if (!response.ok) {
                    throw new Error("Failed to fetch tokens");
                }
                const data = (await response.json()) as TokensResponse;
                const allTokens: Token[] = Object.values(data.tokens).flat();
                setTokens(allTokens);
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);
    console.log({ tokens });

    // Filter tokens by active wallets, otherwise show all
    const displayTokens = useMemo(() => {
        if (currentTokens && currentTokens.length > 0) {
            return tokens.filter((token) =>
                currentTokens.some(
                    (ct) =>
                        ct.symbol.toLowerCase() === token.symbol.toLowerCase()
                )
            );
        }
        return tokens;
    }, [tokens, currentTokens]);

    const Row = useCallback(
        ({ index, style }: ListChildComponentProps) => {
            const token = displayTokens[index];
            return (
                <div
                    style={style}
                    className="flex items-center px-4 py-2 border-b border-gray-700 hover:bg-gray-800 transition-colors"
                >
                    <TokenLogo
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-10 h-10 mr-4 rounded-full"
                    />
                    <div>
                        <div className="font-semibold text-lg text-white">
                            {token.name}{" "}
                            <span className="text-sm text-gray-400">
                                ({token.symbol})
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Price: ${token.priceUSD}
                        </div>
                    </div>
                </div>
            );
        },
        [displayTokens]
    );

    if (loading) {
        return (
            <div className="text-center mt-10 text-lg text-white">
                Loading tokens...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-500">Error: {error}</div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 w-[400px]">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">
                LI.FI Tokens
            </h1>
            <div className="bg-transparent rounded-lg overflow-hidden">
                <List
                    height={600}
                    itemCount={displayTokens.length}
                    itemSize={100}
                    width="100%"
                    className="no-scrollbar"
                >
                    {Row}
                </List>
            </div>
        </div>
    );
}
