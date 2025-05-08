import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  graphqlRequest,
  USER_QUERY,
  CURSUS_QUERY,
  PROJECT_QUERY,
  CURSUS_INFO_QUERY,
  AUDIT_QUERY,
  XP_QUERY,
  LEVEL_QUERY,
  LAST_PROJECT_QUERY,
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

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [cursus, setCursus] = useState<Cursus[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cursusInfo, setCursusInfo] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [xpCursus, setXpCursus] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [lastProject, setLastProject] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login');
      return;
    }

    // Récupérer infos utilisateur
    graphqlRequest(USER_QUERY, token)
      .then((data) => {
        setUserInfo(data.user[0]);
      })
      .catch(() => router.push('/login'));

    // Récupérer cursus
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

    // Récupérer transactions projet
    graphqlRequest(PROJECT_QUERY(1), token) // ici tu mets l'ID d'un cursus ou projet réel
      .then((data) => {
        const txList = data.transaction.map((tx: any) => ({
          amount: tx.amount,
          path: tx.object?.name ?? 'unknown',
        }));
        setTransactions(txList);
        setLoading(false);
      })
      .catch(() => console.log('Erreur chargement transactions'));

  }, [router]);

  // Charger les autres queries quand cursus et userInfo sont prêts
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token || cursus.length === 0 || !userInfo) return;

    const firstCursusId = cursus[0]?.id;

    // CURSUS_INFO_QUERY
    graphqlRequest(CURSUS_INFO_QUERY(firstCursusId), token)
      .then((data) => {
        setCursusInfo(data);
      })
      .catch(() => console.log('Erreur chargement info cursus'));

    // AUDIT_QUERY
    graphqlRequest(AUDIT_QUERY(userInfo.login), token)
      .then((data) => {
        setAudits(data.audit);
      })
      .catch(() => console.log('Erreur chargement audits'));

    // XP_QUERY
    graphqlRequest(XP_QUERY(firstCursusId), token)
      .then((data) => {
        const amount = data.transaction_aggregate.aggregate.sum.amount;
        setXpCursus(amount);
      })
      .catch(() => console.log('Erreur chargement XP cursus'));

    // LEVEL_QUERY
    graphqlRequest(LEVEL_QUERY(userInfo.login, firstCursusId), token)
      .then((data) => {
        const levelData = data.event_user[0]?.level ?? null;
        setLevel(levelData);
      })
      .catch(() => console.log('Erreur chargement niveau'));

    // LAST_PROJECT_QUERY
    graphqlRequest(LAST_PROJECT_QUERY, token)
      .then((data) => {
        setLastProject(data.progress[0]);
      })
      .catch(() => console.log('Erreur chargement dernier projet'));

  }, [cursus, userInfo]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-20 text-xl">Chargement...</p>;

  return (
    <div className="px-15 bg-gradient-to-r from-black to-blue-800 text-gray-200 p-4">
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
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {cursus.length > 0 ? (
          cursus.map((c, idx) => (
            <div
              key={idx}
              className="relative group p-4 bg-black rounded-2xl shadow text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white-400 to-blue-500 opacity-0 group-hover:opacity-20 transition duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <h2 className="font-semibold text-lg">{c.name}</h2>
                <p>Type : {c.type}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun cursus trouvé.</p>
        )}
      </section>

      {/* Infos complémentaires */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Infos Cursus</h3>
          <pre>{JSON.stringify(cursusInfo, null, 2)}</pre>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Audits</h3>
          {audits.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">Projet</th>
                  <th scope="col" className="px-4 py-2">Capitaine</th>
                  <th scope="col" className="px-4 py-2">Grade</th>
                  <th scope="col" className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="px-4 py-2">{audit.group.object.name}</td>
                    <td className="px-4 py-2">{audit.group.captainLogin}</td>
                    <td className="px-4 py-2">{audit.grade !== null ? audit.grade.toFixed(2) : 'En cours'}</td>
                    <td className="px-4 py-2">{new Date(audit.group.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun audit trouvé.</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">XP Cursus</h3>
          <p className="text-2xl font-bold text-purple-400">
            {xpCursus !== null ? `${xpCursus.toLocaleString()} XP` : 'Chargement...'}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Niveau</h3>
          <p className="text-2xl font-bold text-green-400">
            {level !== null ? `Niveau ${level}` : 'Chargement...'}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Dernier Projet</h3>
          {lastProject ? (
            <div>
              <p><strong>Nom :</strong> {lastProject.object.name}</p>
              <p><strong>Type :</strong> {lastProject.object.type}</p>
              <p><strong>Date :</strong> {new Date(lastProject.createdAt).toLocaleDateString()}</p>
              <p><strong>Terminé :</strong> {lastProject.isDone ? 'Oui' : 'Non'}</p>
            </div>
          ) : (
            <p>Aucun projet trouvé.</p>
          )}
        </div>

      </section>
    </div>
  );
}
