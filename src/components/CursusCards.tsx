// CursusCards.tsx
export default function CursusCards({ cursus }) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {cursus.length > 0 ? (
          cursus.map((c, idx) => (
            <div
              key={idx}
              className="relative group p-4 bg-black rounded-2xl shadow text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white-400 to-blue-500 opacity-0 group-hover:opacity-20 transition duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <h2 className="font-semibold text-lg">{c.name}</h2>
                <p>Type : {c.type}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun cursus trouvé.</p>
        )}
      </section>
    );
  }