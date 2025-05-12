// ProfileHeader.tsx
import { useRouter } from 'next/router';

interface UserInfo {
  login: string;
  totalUp: number;
  totalDown: number;
}

export default function ProfileHeader({ userInfo }: { userInfo: UserInfo | null }) {

  const router = useRouter();
  if (!userInfo) return null;
  
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-center mb-8 ">
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
  );
}



