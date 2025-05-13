  // XpCursusCard.tsx
  export default function XpCursusCard({ xpCursus }: { xpCursus: number | null }) {
    return (
      <div className="shadow text-center">
        <p className="text-2xl font-bold text-white-400">
          {xpCursus !== null ? `${xpCursus.toLocaleString()} XP` : 'Chargement...'}
        </p>
      </div>
    );
  }
  