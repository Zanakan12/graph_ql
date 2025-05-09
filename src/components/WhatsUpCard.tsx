export default function WhatsUpCard({ lastProject }) {
    return (
      <div className="bg-gray-800 p-4 rounded shadow mb-8 text-center w-full">
        <h3 className="text-lg font-semibold mb-4">What's up</h3>
        {lastProject ? (
          <div>
            <p className="text-xl font-bold text-purple-400 mb-4">
              {lastProject.object.name}
            </p>
            <p className="text-sm text-gray-500">
              Date de démarrage : {new Date(lastProject.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-orange-300 font-semibold">
              {lastProject.isDone ? 'Terminé ✔️' : 'Encore en cours'}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Aucun projet en cours trouvé.</p>
        )}
      </div>
    );
  }
  