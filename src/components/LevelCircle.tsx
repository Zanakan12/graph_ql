 // LevelCircle.tsx
import Link from 'next/link';

 interface Props {
  level: number | null;
}

export default function LevelCircle({ level }: Props) {
    return (
      <Link href="/ranks">
        <div className="bg-black border p-4 shadow text-center rounded-full w-20 h-20 hover:shadow-xl hover:bg-blue-400 hover:scale-105 transition-all duration-200 ease-in-out">
          <h3 className="font-semibold">Niveau</h3>
          <p className="text-2xl font-bold text-gray-400">
            {level !== null ? `${level}` : 'Chargement...'}
          </p>
        </div>
      </Link>
    );
  }
  