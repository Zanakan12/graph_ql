// AuditsTable.tsx
export default function AuditsTable({ audits }) {
    return (
      <div className="bg-gray-800 p-4 rounded shadow overflow-auto ">
        <h3 className="text-lg font-semibold mb-2">Audits</h3>
        {audits.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th className="px-4 py-2">Projet</th>
                <th className="px-4 py-2">Capitaine</th>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {audits.slice(0, 3).map((audit, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-600">
                  <td className="px-4 py-2">{audit.group.object.name}</td>
                  <td className="px-4 py-2">{audit.group.captainLogin}</td>
                  <td className="px-4 py-2">
                    {audit.grade !== null ? audit.grade.toFixed(2) : 'En cours'}
                  </td>
                  <td className="px-4 py-2">{new Date(audit.group.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun audit trouvé.</p>
        )}
      </div>
    );
  }
  
