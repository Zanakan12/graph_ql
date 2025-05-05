import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface UserInfo {
  id: number;
  login: string;
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login');
      return;
    }

    const query = `
      {
        user {
          id
          login
        }
      }
    `;

    fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserInfo(data.data.user[0]);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      {userInfo && (
        <>
          <p>ID : {userInfo.id}</p>
          <p>Login : {userInfo.login}</p>
        </>
      )}

      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
        Déconnexion
      </button>

      <h3 className="text-xl font-semibold mt-8">Mes Graphiques</h3>

      <svg id="graph1" width="500" height="300" className="border mt-4">
        {/* Graphique 1 */}
      </svg>

      <svg id="graph2" width="500" height="300" className="border mt-4">
        {/* Graphique 2 */}
      </svg>
    </div>
  );
}
