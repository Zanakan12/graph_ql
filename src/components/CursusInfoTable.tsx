// CursusInfoTable.tsx
interface CursusInfoEvent {
  id: number;
  startAt: string;
  endAt: string;
  object: {
    name: string;
    type: string;
  };
  parent?: {
    id: number;
    object: {
      name: string;
      type: string;
    };
  } | null;
}

interface Props {
  cursusInfo: { event: CursusInfoEvent[] } | null;
}

export default function CursusInfoTable({ cursusInfo }: Props) {

    return (
      <div className="bg-black p-4 rounded shadow h-fit ">
        <h3 className="text-lg font-semibold mb-2">Infos Cursus</h3>
        {cursusInfo?.event && cursusInfo.event.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg- text-gray-400">
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Début</th>
                <th className="px-4 py-2">Fin</th>
              </tr>
            </thead>
            <tbody>
              {cursusInfo.event.map((c, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-600">
                  <td className="px-4 py-2">{c.object.name}</td>
                  <td className="px-4 py-2">{c.object.type}</td>
                  <td className="px-4 py-2">{new Date(c.startAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(c.endAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune info cursus trouvée.</p>
        )}
      </div>
    );
  }