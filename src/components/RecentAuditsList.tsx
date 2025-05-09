export default function RecentAuditsList({ audits }) {
    return (
      <div className="bg-gray-800 p-4 rounded shadow mb-8 ">
        <h3 className="text-lg font-semibold mb-4">Les derniers élèves auditionnés</h3>
        {audits.length > 0 ? (
          <div className="space-y-4">
            {audits.slice(0, 3).map((audit, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-white">{audit.group.captainLogin}</p>
                  <p
                    className={`text-xs ${
                      audit.grade !== null ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {audit.grade !== null ? 'Complété' : 'En cours'}
                  </p>
                </div>
                <p className="text-sm text-gray-300">
                  Projet : {audit.group.object.name}
                </p>
                <p className="text-xs text-gray-400">
                  Date : {new Date(audit.group.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Aucune collaboration récente.</p>
        )}
      </div>
    );
  }