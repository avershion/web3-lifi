"use client";
import { useState } from "react";
import WalletConnector from "../WalletConnector/WalletConnector";
import TokenList from "../TokenList/TokenList";
import { TokenType } from "../TokenList/types";

export default function HomePage() {
    const [currentTokens, setCurrentTokens] = useState<TokenType[]>([]);
    console.log({ currentTokens });
    return (
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
            <WalletConnector
                setCurrentTokens={setCurrentTokens}
                currentTokens={currentTokens}
            />
            <TokenList currentTokens={currentTokens} />
        </div>
    );
}
