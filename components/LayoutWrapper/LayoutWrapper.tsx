"use client";
import { useState, useEffect } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, goerli, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
    chains: [mainnet, goerli, polygon],
    transports: {
        [mainnet.id]: http(),
        [goerli.id]: http(),
        [polygon.id]: http(),
    },
});

export default function LayoutWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Prevent hydration issue
    if (!isClient) return null;

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
