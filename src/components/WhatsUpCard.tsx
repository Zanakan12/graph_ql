interface Project {
  createdAt: string;
  isDone: boolean;
  object: {
    name: string;
    type: string;
  };
}

export default function WhatsUpCard({ lastProject }: { lastProject: Project | null }) {
  if (!lastProject) {
    return (
      <div className="bg-black p-4 rounded shadow mb-4 w-full border">
        <h3 className="text-lg font-semibold mb-2">What&apos;s up</h3>
        <p className="text-gray-400">Aucun projet en cours trouvé.</p>
      </div>
    );
  }

  return (
    <div className="bg-black p-4 rounded shadow mb-4 w-full border">
      <h3 className="text-lg font-semibold mb-2">What&apos;s up</h3>
      <p className="text-blue-600 font-bold text-xl mb-2">{lastProject.object.name}</p>
      <p className="text-sm text-gray-400">
        Commencé le {new Date(lastProject.createdAt).toLocaleDateString()}
      </p>
      <p className="text-green-400 font-medium mt-2">
        {lastProject.isDone ? 'Projet terminé' : 'Encore en cours ...'}
      </p>
    </div>
  );
}
