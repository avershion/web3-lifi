import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WalletConnector from "./WalletConnector";

jest.mock("wagmi", () => ({
    useAccount: () => ({ address: null, isConnected: false }),
    useConnect: () => ({
        connect: jest.fn(),
        connectors: [{ id: "dummy", name: "Dummy Connector" }],
    }),
    useDisconnect: () => ({ disconnect: jest.fn() }),
    useBalance: () => ({ data: null, refetch: jest.fn() }),
}));

jest.mock("./SolanaWallet", () => {
    return function DummySolanaWallet() {
        return <div>SolanaWallet Component</div>;
    };
});

jest.mock("../Button/Button", () => {
    return function DummyButton({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick: () => void;
    }) {
        return <button onClick={onClick}>{children}</button>;
    };
});

describe("WalletConnector Component", () => {
    const setCurrentTokens = jest.fn();
    const currentTokens: any[] = [];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders wallet connector container and headings", () => {
        render(
            <WalletConnector
                setCurrentTokens={setCurrentTokens}
                currentTokens={currentTokens}
            />
        );

        expect(screen.getByText(/Wallet Connector/i)).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Solana" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "EVM" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Bitcoin" })
        ).toBeInTheDocument();
    });

    test("renders 'Connect Unisat' button when Bitcoin wallet is not connected", () => {
        render(
            <WalletConnector
                setCurrentTokens={setCurrentTokens}
                currentTokens={currentTokens}
            />
        );

        expect(
            screen.getByRole("button", { name: /Connect Unisat/i })
        ).toBeInTheDocument();
    });

    test("renders 'Connect' button for EVM wallet when not connected", () => {
        render(
            <WalletConnector
                setCurrentTokens={setCurrentTokens}
                currentTokens={currentTokens}
            />
        );

        expect(
            screen.getByRole("button", { name: /Connect Dummy Connector/i })
        ).toBeInTheDocument();
    });
});
