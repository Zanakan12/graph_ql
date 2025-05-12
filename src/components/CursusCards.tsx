interface Props {
  cursus: { id: number; name: string; type: string }[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function CursusCards({ cursus, selectedId, onSelect }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cursus.length > 0 ? (
        cursus.map((c) => {
          const isActive = c.id === selectedId;
          return (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`relative group p-4 rounded-2xl shadow text-center overflow-hidden cursor-pointer transition ${
                isActive ? 'bg-blue-900 border border-blue-400' : 'bg-black'
              }`}
            >
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white-400 to-blue-500 opacity-0 group-hover:opacity-20 transition duration-500 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="font-semibold text-lg">{c.name}</h2>
                <p className="text-sm text-gray-400">Type : {c.type}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p>Aucun cursus trouvé.</p>
      )}
    </section>
  );
}
