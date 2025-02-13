import HomePage from "../components/HomePage/HomePage";

export default function Home() {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-4 sm:p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <header className="w-full text-center"></header>
            <main>
                <HomePage />
            </main>
            <footer className="w-full text-center"></footer>
        </div>
    );
}
