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


import { XpOverTimeChart, XpBarChart } from '../components/XpCharts';
import ProfileHeader from '../components/ProfileHeader';
import CursusCards from '../components/CursusCards';
import CursusInfoTable from '../components/CursusInfoTable';
import XpCursusCard from '../components/XpCursusCard';
import LevelCircle from '../components/LevelCircle';
import AuditRatioCard from '../components/AuditRatioCard';
import WhatsUpCard from '../components/WhatsUpCard';
import RecentAuditsList from '../components/RecentAuditsList';
import BestSkillsRadar from '../components/BestSkillsRadar';

interface UserAttrs {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  addressStreet: string;
  addressComplementStreet: string;
  addressPostalCode: string;
  addressCity: string;
  addressCountry: string;
  email: string;
  Phone: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyAffiliation: string;
  emergencyTel: string;
}
interface UserInfo {
  login: string;
  totalUp: number;
  totalDown: number;
  attrs: UserAttrs;
}


interface CursusEvent {
  event: {
    id: number;
    object: {
      name: string;
      type: string;
    };
  };
}

interface Cursus {
  id: number;
  name: string;
  type: string;
}

interface Transaction {
  amount: number;
  createdAt: string;
  object?: {
    name?: string;
  };
}


export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedCursusId, setSelectedCursusId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [cursusInfo, setCursusInfo] = useState(null);
  const [cursus, setCursus] = useState<Cursus[]>([]);
  const [audits, setAudits] = useState([]);
  const [xpCursus, setXpCursus] = useState(null);
  const [level, setLevel] = useState(null);
  const [lastProject, setLastProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login');
      return;
    }

    graphqlRequest(USER_QUERY, token)
      .then((data) => {
        setUserInfo(data.user[0]);
      })
      .catch(() => router.push('/login'));


    graphqlRequest(CURSUS_QUERY, token)
      .then((data) => {
        const events = data.user[0].events;
        const cursusList = events.map((e: CursusEvent) => ({
          id: e.event.id,
          name: e.event.object.name,
          type: e.event.object.type,
        }));        
        setCursus(cursusList);
      })
      .catch(() => console.log('Erreur chargement cursus'));
  }, [router]);

  // Initialiser selectedCursusId dès que cursus est prêt
  useEffect(() => {
    if (cursus.length > 0 && selectedCursusId === null) {
      setSelectedCursusId(cursus[0].id);
    }
  }, [cursus, selectedCursusId]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token || !selectedCursusId || !userInfo) return;


    Promise.all([
      graphqlRequest(CURSUS_INFO_QUERY(selectedCursusId), token).then(setCursusInfo),
      graphqlRequest(AUDIT_QUERY(userInfo.login), token).then((data) => setAudits(data.audit)),
      graphqlRequest(XP_QUERY(selectedCursusId), token).then((data) =>
        setXpCursus(data.transaction_aggregate.aggregate.sum.amount)
      ),
      graphqlRequest(LEVEL_QUERY(userInfo.login, selectedCursusId), token).then((data) =>
        setLevel(data.event_user[0]?.level ?? null)
      ),
      graphqlRequest(LAST_PROJECT_QUERY, token).then((data) => {
        console.log("data of last project",userInfo)
        const project = data.progress && data.progress.length > 0 ? data.progress[0] : null;
        setLastProject(project);
      }),

      graphqlRequest(PROJECT_QUERY(selectedCursusId), token).then((data) => {
        const txList = data.transaction.map((tx: Transaction) => ({
          amount: tx.amount,
          path: tx.object?.name ?? 'unknown',
          createdAt: tx.createdAt,
        }));        
        setTransactions(txList);        
      }),
    ])
      .catch((error) => console.log('Erreur chargement des données :', error))
  }, [selectedCursusId, userInfo]);

  //if (loading) return <p className="text-center mt-20 text-xl">Chargement...</p>;

  return (
    <div className="px-15 bg-gradient-to-r from-black to-blue-800 text-gray-200 p-4">
      <ProfileHeader userInfo={userInfo} />
      <div className="w-fit items-center mb-10">
        <div className="ml-6">
          <LevelCircle level={level} />
        </div>
        <div className="m-2">
          <XpCursusCard xpCursus={xpCursus} />
        </div>
        
      </div>

      <CursusCards
        cursus={cursus}
        selectedId={selectedCursusId}
        onSelect={setSelectedCursusId}
      />

      <div className="pb-6">
        <CursusInfoTable cursusInfo={cursusInfo} />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-8">
        <div className="flex flex-wrap h-fit items-center">
        {userInfo && <AuditRatioCard userInfo={userInfo} />}
          <div className='mt-22 w-full'>
            <WhatsUpCard lastProject={lastProject} />
          </div>
        </div>
        <RecentAuditsList audits={audits} />
        <BestSkillsRadar />
      </section>
      
      <section className=" grid grid-cols-1 md:grid-cols-2 gap-1 mb-8">
        <XpBarChart transactions={transactions} />
        <XpOverTimeChart transactions={transactions} />
      </section>
    </div>
  );
}