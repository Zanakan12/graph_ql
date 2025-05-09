// LastProjectCard.tsx
export default function LastProjectCard({ lastProject }) {
    return (
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
    );
  }