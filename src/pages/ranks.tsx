import { useEffect, useState } from 'react';
import {
  graphqlRequest,
  LEVEL_QUERY,
  CURSUS_QUERY,
  USER_QUERY,
} from '../services/apiService';

interface Rank {
  title: string;
  level: number;
}

const ranks: Rank[] = [
  { title: 'Aspiring developer', level: 0 },
  { title: 'Beginner developer', level: 10 },
  { title: 'Apprentice developer', level: 20 },
  { title: 'Assistant developer', level: 30 },
  { title: 'Basic developer', level: 40 },
  { title: 'Junior developer', level: 50 },
  { title: 'Confirmed developer', level: 55 },
  { title: 'Full-Stack developer', level: 60 },
];

export default function RanksPage() {
  const [level, setLevel] = useState<number>(0);
  const [userLogin, setUserLogin] = useState<string>('');
  const [cursusId, setCursusId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    graphqlRequest(USER_QUERY, token).then((data) => {
      const login = data.user[0].login;
      setUserLogin(login);
    });

    graphqlRequest(CURSUS_QUERY, token).then((data) => {
      const cursus = data.user[0].events[0];
      if (cursus) setCursusId(cursus.event.id);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token || !userLogin || !cursusId) return;

    graphqlRequest(LEVEL_QUERY(userLogin, cursusId), token).then((data) => {
      const userLevel = data.event_user[0]?.level || 0;
      setLevel(Math.floor(userLevel));
    });
  }, [userLogin, cursusId]);

  const currentRank = ranks.reduce((acc, rank) => (level >= rank.level ? rank : acc), ranks[0]);
  const nextRank = ranks.find((rank) => rank.level > level);
  const levelToNext = nextRank ? nextRank.level - level : 0;

  return (
    <div className="text-white px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Ranks</h2>
      <p className="text-sm text-gray-400 mb-8">
        The ranks are earned at symbolic stages as you progress through the curriculum. They reflect your
        achievements and demonstrate your abilities as a developer.
      </p>

      {/* Timeline */}
      <div className="relative h-2 bg-gray-700 rounded mb-12 mx-auto max-w-4xl">
        {ranks.map((rank, idx) => (
          <div
            key={idx}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${(rank.level / 60) * 100}%` }}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                level >= rank.level ? 'bg-purple-400' : 'bg-gray-500'
              }`}
            />
            <p className="text-xs mt-2 text-center w-24 -ml-10">
              {rank.title}
              <br />
              <span className="text-xs text-gray-500">Level {rank.level}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Rank Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {ranks.map((rank, idx) => (
          <div
            key={idx}
            className={`rounded-xl border border-gray-600 p-4 text-center transition ${
              rank.level === currentRank.level
                ? 'bg-purple-900/20 border-purple-400'
                : 'bg-gray-800'
            }`}
          >
            <div
              className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                rank.level === currentRank.level
                  ? 'text-purple-400 border border-purple-400'
                  : 'text-gray-400 border border-gray-500'
              }`}
            >
              ★
            </div>
            <h4 className="font-semibold">{rank.title}</h4>
            <p className="text-sm text-gray-400">Level {rank.level}</p>
          </div>
        ))}
      </div>

      {/* Message to next rank */}
      {nextRank && (
        <p className="text-center text-gray-400 text-sm">
          You&apos;re{' '}
          <span className="text-purple-400 font-bold">{levelToNext} level{levelToNext > 1 ? 's' : ''}</span>{' '}
          away from being <span className="text-white font-medium">{nextRank.title}</span>!
        </p>
      )}
    </div>
  );
}
