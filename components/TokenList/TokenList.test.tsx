import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TokenList from "./TokenList";
import { TokenType } from "./types";
import React from "react";

describe("TokenList Component", () => {
    let mockCurrentTokens: TokenType[] = [];

    beforeEach(() => {
        mockCurrentTokens = [
            {
                address: "0x123",
                balance: "5.0",
                symbol: "ETH",
            },
            {
                address: "0x456",
                balance: "0.5",
                symbol: "BTC",
            },
        ];
    });

    it("renders loading message initially", () => {
        render(<TokenList currentTokens={mockCurrentTokens} />);
        expect(screen.getByText(/Loading tokens.../i)).toBeInTheDocument();
    });

    it("renders error message when API fails", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: false })
        ) as jest.Mock;
        render(<TokenList currentTokens={mockCurrentTokens} />);
        expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
    });

    it("renders tokens list correctly when API succeeds", async () => {
        const mockTokensResponse = {
            tokens: {
                "1": [
                    {
                        address: "0x123",
                        balance: "5.0",
                        symbol: "ETH",
                    },
                ],
            },
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTokensResponse),
            })
        ) as jest.Mock;

        render(<TokenList currentTokens={mockCurrentTokens} />);
        expect(await screen.findByText(/ETH/i)).toBeInTheDocument();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
