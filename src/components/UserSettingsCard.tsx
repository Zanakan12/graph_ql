import { useState } from 'react';

interface UserSettingsProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    city?: string;
    country?: string;
  };
}

export default function UserSettingsCard({ user }: UserSettingsProps) {
  const [editableUser, setEditableUser] = useState(user);

  const handleChange = (field: keyof typeof user, value: string) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSave = () => {
    // Implémenter l'enregistrement ici (ex: API request)
    console.log('🔧 Données enregistrées :', editableUser);
    alert('Modifications enregistrées !');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md text-white max-w-2xl mx-auto mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Paramètres Utilisateur</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Prénom</label>
          <input
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editableUser.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Nom</label>
          <input
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editableUser.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editableUser.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Téléphone</label>
          <input
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editableUser.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Ville</label>
          <input
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editableUser.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Pays</label>
          <input
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editableUser.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
