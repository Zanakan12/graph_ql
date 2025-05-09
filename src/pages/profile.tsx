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

import ProfileHeader from '../components/ProfileHeader';
import CursusCards from '../components/CursusCards';
import CursusInfoTable from '../components/CursusInfoTable';
import AuditsTable from '../components/AuditsTable';
import XpCursusCard from '../components/XpCursusCard';
import LevelCircle from '../components/LevelCircle';
import LastProjectCard from '../components/LastProjectCard';
import AuditRatioCard from '../components/AuditRatioCard';
import WhatsUpCard from '../components/WhatsUpCard';
import RecentAuditsList from '../components/RecentAuditsList';
import BestSkillsRadar from '../components/BestSkillsRadar';
import XpProgressChart from '../components/XpProgressChart';
import XpBarChart from '../components/XpBarChart';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [cursus, setCursus] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cursusInfo, setCursusInfo] = useState(null);
  const [audits, setAudits] = useState([]);
  const [xpCursus, setXpCursus] = useState(null);
  const [level, setLevel] = useState(null);
  const [lastProject, setLastProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login');
      return;
    }

    graphqlRequest(USER_QUERY, token)
      .then((data) => setUserInfo(data.user[0]))
      .catch(() => router.push('/login'));

    graphqlRequest(CURSUS_QUERY, token)
      .then((data) => {
        const events = data.user[0].events;
        const cursusList = events.map((e) => ({
          id: e.event.id,
          name: e.event.object.name,
          type: e.event.object.type,
        }));
        setCursus(cursusList);
      })
      .catch(() => console.log('Erreur chargement cursus'));
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token || cursus.length === 0 || !userInfo) return;

    const firstCursusId = cursus[0]?.id;

    // Chargement des infos cursus
    graphqlRequest(CURSUS_INFO_QUERY(firstCursusId), token)
      .then((data) => setCursusInfo(data))
      .catch(() => console.log('Erreur chargement info cursus'));

    // Chargement des audits
    graphqlRequest(AUDIT_QUERY(userInfo.login), token)
      .then((data) => setAudits(data.audit))
      .catch(() => console.log('Erreur chargement audits'));

    // Chargement de l'XP du cursus
    graphqlRequest(XP_QUERY(firstCursusId), token)
      .then((data) => {
        const amount = data.transaction_aggregate.aggregate.sum.amount;
        setXpCursus(amount);
      })
      .catch(() => console.log('Erreur chargement XP cursus'));

    // Chargement du niveau
    graphqlRequest(LEVEL_QUERY(userInfo.login, firstCursusId), token)
      .then((data) => {
        const levelData = data.event_user[0]?.level ?? null;
        setLevel(levelData);
      })
      .catch(() => console.log('Erreur chargement niveau'));

    // Chargement du dernier projet
    graphqlRequest(LAST_PROJECT_QUERY, token)
      .then((data) => setLastProject(data.progress[0]))
      .catch(() => console.log('Erreur chargement dernier projet'));

    // Chargement des transactions (XP projets)
    graphqlRequest(PROJECT_QUERY(firstCursusId), token)
      .then((data) => {
        const txList = data.transaction.map((tx) => ({
          amount: tx.amount,
          path: tx.object?.name ?? 'unknown',
        }));
        console.log('Transactions projet:', data);
        setTransactions(txList);
        setLoading(false); // ✅ FIN DU CHARGEMENT
      })
      .catch(() => {
        console.log('Erreur chargement transactions');
        setLoading(false); // même en cas d'erreur, on évite de bloquer
      });

  }, [cursus, userInfo]);

  if (loading) return <p className="text-center mt-20 text-xl">Chargement...</p>;

  return ( 
    <div className="px-15 bg-gradient-to-r from-black to-blue-800 text-gray-200 p-4">
      <ProfileHeader userInfo={userInfo} />
      <div className="flex flex-wrap h-fit items-center">
          <LevelCircle level={level} />
          <XpCursusCard xpCursus={xpCursus} />
      </div>

      <CursusCards cursus={cursus} />

      <div className="pb-6">
        <CursusInfoTable cursusInfo={cursusInfo} />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-8">
        <div className="flex flex-wrap h-fit items-center">
            <AuditRatioCard userInfo={userInfo} />
            <WhatsUpCard lastProject={lastProject} />
        </div>
        <RecentAuditsList audits={audits} />
      </section>
      
      <BestSkillsRadar />
      <XpBarChart transactions={transactions} />
      <XpProgressChart transactions={transactions} />
    </div>
  );
}
