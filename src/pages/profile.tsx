import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  graphqlRequest,
  USER_QUERY,
  CURSUS_QUERY,
  PROJECT_QUERY_ALL,
} from '../services/apiService';

// TYPES
interface UserInfo {
  login: string;
  totalUp: number;
  totalDown: number;
}

interface Cursus {
  id: number;
  name: string;
  type: string;
}

interface Transaction {
  amount: number;
  path: string;
}

interface Skill {
  labelName: string;
}

const fakeSkills = [
  { labelName: 'Front-End' },
  { labelName: 'Back-End' },
  { labelName: 'Algorithms' },
  { labelName: 'Databases' },
  { labelName: 'DevOps' },
];

// COMPONENT
export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [cursus, setCursus] = useState<Cursus[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login');
      return;
    }

    // 1️⃣ Récupérer les infos utilisateur
    graphqlRequest(USER_QUERY, token)
    .then((data) => {
      console.log('DATA USER:', data.user[0]); // 👈 regarde ça dans la console
      setUserInfo(data.user[0]);
      setSkills(data.user[0].labels);
  })  
  .catch(() => router.push('/login'));


    // 2️⃣ Récupérer les cursus
    graphqlRequest(CURSUS_QUERY, token)
      .then((data) => {
        const events = data.user[0].events;
        const cursusList = events.map((e: any) => ({
          id: e.event.id,
          name: e.event.object.name,
          type: e.event.object.type,
        }));
        setCursus(cursusList);
      })
      .catch(() => console.log('Erreur chargement cursus'));

      graphqlRequest(PROJECT_QUERY_ALL, token)
      .then((data) => {
        console.log('Transactions reçues :', data.transaction);
        const txList = data.transaction.map((tx: any) => ({
          amount: tx.amount,
          path: tx.object?.name ?? 'unknown',
        }));
        setTransactions(txList);
        setLoading(false);
      })
      .catch(() => console.log('Erreur chargement transactions'));    
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-20 text-xl">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Bienvenue, {userInfo?.login.toUpperCase()}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </header>

      {/* Cartes Cursus Dynamiques */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cursus.length > 0 ? (
          cursus.map((c, idx) => (
            <div key={idx} className="bg-purple-700 p-4 rounded shadow text-center">
              <h2 className="font-semibold text-lg">{c.name}</h2>
              <p>Type : {c.type}</p>
            </div>
          ))
        ) : (
          <p>Aucun cursus trouvé.</p>
        )}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Mon XP Total</h3>
          <p className="text-2xl font-bold">{userInfo?.totalUp} KB</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Audits</h3>
          <p className="text-2xl font-bold">12 Passés</p>
          <p className="text-green-500">👍 Aucun en attente</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Ratio Audit</h3>
          <p className="text-2xl font-bold">0.9</p>
          <p className="text-yellow-400">⚠️ Attention à la moyenne</p>
        </div>
      </section>

      {/* Graphique XP Distribution */}
      <section className="bg-gray-800 p-4 rounded shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Distribution XP par Projet
        </h3>
        <svg width="100%" height="300" className="bg-gray-700 rounded">
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx, idx) => {
              const barHeight = tx.amount / 10; // Ajuster si XP trop grand
              const width = 60;
              const gap = 20;
              const x = idx * (width + gap) + gap;
              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={300 - barHeight}
                    width={width}
                    height={barHeight}
                    fill="teal"
                  />
                  <text
                    x={x + width / 2}
                    y={290}
                    fontSize={10}
                    textAnchor="middle"
                    fill="white"
                  >
                    {tx.path}
                  </text>
                  <text
                    x={x + width / 2}
                    y={300 - barHeight - 5}
                    fontSize={10}
                    textAnchor="middle"
                    fill="white"
                  >
                    {tx.amount}
                  </text>
                </g>
              );
            })
          ) : (
            <text x="50%" y="50%" fill="white" fontSize="16" textAnchor="middle">
              Aucune donnée XP
            </text>
          )}
        </svg>
      </section>

      <section className="bg-gray-800 p-4 rounded shadow mb-8">
  <h3 className="text-lg font-semibold mb-4 text-center">
    Progression XP dans le temps
  </h3>
  <svg width="100%" height="300" className="bg-gray-700 rounded">
    {transactions.length > 0 ? (() => {
      const sorted = [...transactions]
        .filter((tx) => tx.amount > 0)
        .slice(0, 10)
        .map((tx, idx) => ({
          ...tx,
          date: new Date().getTime() + idx * 86400000, // simulation car on n’a pas `createdAt`
        }));

      let cumulative = 0;
      const points = sorted.map((tx, i) => {
        cumulative += tx.amount;
        const x = (i / (sorted.length - 1)) * 500;
        const y = 300 - (cumulative / 10000); // Échelle à ajuster selon ton XP total
        return { x, y, value: cumulative };
      });

      const pathData = points.map((p, i) =>
        i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`
      ).join(' ');

      return (
        <>
          <path d={pathData} stroke="cyan" strokeWidth="2" fill="none" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="cyan" />
              <text x={p.x} y={p.y - 10} fontSize="10" fill="white" textAnchor="middle">
                {Math.round(p.value)}
              </text>
            </g>
          ))}
        </>
      );
    })() : (
      <text x="50%" y="50%" fill="white" fontSize="16" textAnchor="middle">
        Aucune donnée
      </text>
    )}
  </svg>
</section>

<section className="bg-gray-800 p-4 rounded shadow mb-8">
  <h3 className="text-lg font-semibold mb-4 text-center">
    Mes Compétences (Radar Chart)
  </h3>
  <svg viewBox="0 0 400 400" width="100%" height="400" className="bg-gray-700 rounded">
    {fakeSkills.length > 0 ? (() => {
      const centerX = 200;
      const centerY = 200;
      const radius = 100;
      const total = skills.length;
      const points = skills.map((skill, i) => {
        const angle = (2 * Math.PI * i) / total - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y, label: skill.labelName };
      });

      const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

      return (
        <>
          {/* Toile de fond (radar) */}
          <polygon
            points={polygonPoints}
            stroke="cyan"
            strokeWidth="2"
            fill="rgba(0, 255, 255, 0.3)"
          />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="cyan" />
              <text
                x={p.x}
                y={p.y}
                fontSize="12"
                fill="white"
                textAnchor={p.x < centerX ? 'end' : 'start'}
                alignmentBaseline="middle"
              >
                {p.label}
              </text>
              {/* Ligne depuis le centre */}
              <line
                x1={centerX}
                y1={centerY}
                x2={p.x}
                y2={p.y}
                stroke="gray"
                strokeDasharray="2"
              />
            </g>
          ))}
        </>
      );
    })() : (
      <text x="50%" y="50%" fill="white" fontSize="16" textAnchor="middle">
        Aucune compétence trouvée
      </text>
    )}
  </svg>
</section>

<section className="bg-gray-800 p-4 rounded shadow mb-8">
  <h3 className="text-lg font-semibold mb-4 text-center">
    Mes Compétences (Radar Chart)
  </h3>
  <svg viewBox="0 0 400 400" width="100%" height="400" className="bg-gray-700 rounded">
    {(() => {
      const combinedSkills = [
        ...skills,
        { labelName: 'Front-End' },
        { labelName: 'Back-End' },
        { labelName: 'Algorithms' },
        { labelName: 'Databases' },
        { labelName: 'DevOps' },
      ];
      const centerX = 200;
      const centerY = 200;
      const radius = 100;
      const total = combinedSkills.length;
      const points = combinedSkills.map((skill, i) => {
        const angle = (2 * Math.PI * i) / total - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y, label: skill.labelName };
      });

      const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

      return (
        <>
          <polygon
            points={polygonPoints}
            stroke="cyan"
            strokeWidth="2"
            fill="rgba(0, 255, 255, 0.3)"
          />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="cyan" />
              <text
                x={p.x}
                y={p.y}
                fontSize="12"
                fill="white"
                textAnchor={p.x < centerX ? 'end' : 'start'}
                alignmentBaseline="middle"
              >
                {p.label}
              </text>
              <line
                x1={centerX}
                y1={centerY}
                x2={p.x}
                y2={p.y}
                stroke="gray"
                strokeDasharray="2"
              />
            </g>
          ))}
        </>
      );
    })()}
  </svg>
</section>

    </div>
  );
}
