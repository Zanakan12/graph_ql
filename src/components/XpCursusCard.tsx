  // XpCursusCard.tsx
  export default function XpCursusCard({ xpCursus }) {
    return (
      <div className="bg-gray-800 rounded shadow text-center">
        <p className="text-2xl font-bold text-white-400">
          {xpCursus !== null ? `${xpCursus.toLocaleString()} XP` : 'Chargement...'}
        </p>
      </div>
    );
  }
  