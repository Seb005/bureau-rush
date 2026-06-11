import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark vignette p-4">
      <div className="max-w-lg text-center">
        <h1 className="text-xl text-neon-cyan text-glow-cyan mb-8">
          À PROPOS
        </h1>
        <div className="text-[10px] leading-relaxed text-gray-300 space-y-4">
          <p>
            <span className="text-neon-green">BUREAU RUSH</span> est un jeu
            arcade rétro inspiré de la vie dans les organismes soumis au
            «joug du ministère». Lesquels? On ne le dira pas.
          </p>
          <p>
            Les clients arrivent, les documents s&apos;empilent, le téléphone
            sonne, et le ministère veut des rapports. Le rythme accélère.
            Tu dois survivre à la bureaucratie sans faire de burnout.
          </p>
          <p className="text-neon-pink">
            Aucun fonctionnaire n&apos;a été blessé durant la production de ce
            jeu.
          </p>
          <p className="mt-8 text-gray-500">
            Concept et développement: Sébas
          </p>
        </div>
        <Link
          href="/"
          className="btn-arcade bg-transparent text-neon-green border-neon-green hover:bg-neon-green hover:text-dark text-xs mt-8 inline-block"
        >
          RETOUR
        </Link>
      </div>
    </div>
  );
}
