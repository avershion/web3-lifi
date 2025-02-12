import TokenList from "@/components/TokensList/TokensList";
import WalletConnector from "@/components/WalletConnector/WalletConnector";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex gap-8 row-start-2 items-center sm:items-start">
                <WalletConnector />
                <TokenList />
            </main>
        </div>
    );
}
