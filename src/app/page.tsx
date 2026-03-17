import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark vignette p-4">
      <main className="flex flex-col items-center gap-8 text-center">
        <div>
          <h1 className="text-2xl sm:text-4xl text-neon-green text-glow-green leading-relaxed">
            BUREAU RUSH
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-neon-cyan text-glow-cyan">
            La folie de l&apos;employabilité
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/play"
            className="btn-arcade bg-neon-green text-dark border-neon-green hover:bg-neon-yellow"
          >
            JOUER
          </Link>
          <Link
            href="/scores"
            className="btn-arcade bg-transparent text-neon-cyan border-neon-cyan hover:bg-neon-cyan hover:text-dark"
          >
            MES SCORES
          </Link>
          <Link
            href="/about"
            className="btn-arcade bg-transparent text-neon-pink border-neon-pink hover:bg-neon-pink hover:text-dark"
          >
            À PROPOS
          </Link>
        </div>

        <p className="mt-12 text-[8px] text-gray-500">
          Kodra Conseil s.e.n.c. — 2026
        </p>
      </main>
    </div>
  );
}
