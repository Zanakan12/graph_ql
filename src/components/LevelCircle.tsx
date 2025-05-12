 // LevelCircle.tsx
 interface Props {
  level: number | null;
}

export default function LevelCircle({ level }: Props) {
    return (
      <div className="bg-gray-800 p-4 shadow text-center rounded-full w-20 h-20">
        <h3 className="font-semibold">Niveau</h3>
        <p className="text-2xl font-bold text-gray-400">
          {level !== null ? `${level}` : 'Chargement...'}
        </p>
      </div>
    );
  }
  