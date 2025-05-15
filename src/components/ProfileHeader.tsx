// ProfileHeader.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Importation dynamique (pour éviter problème côté serveur si besoin)
const UserInfoPanel = dynamic(() => import('./UserInfoPanel'));

interface UserInfo {
  login: string;
  totalUp: number;
  totalDown: number;
  attrs: {
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
  };
}

export default function ProfileHeader({ userInfo }: { userInfo: UserInfo | null }) {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState(false);

  if (!userInfo) return null;

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          {/* Avatar SVG Cliquable */}
          <div
            onClick={() => setShowPanel(!showPanel)}
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A10.003 10.003 0 0112 15a10.003 10.003 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold">
            Bienvenue, {userInfo.login.toUpperCase()}!
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </header>

      {/* Affichage du panel utilisateur */}
      {showPanel && <UserInfoPanel user={userInfo} />}
    </>
  );
}
