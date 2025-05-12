interface Audit {
  grade: number | null;
  resultId: number | null;
  private: {
    code: string | null;
  };
  group: {
    captainLogin: string;
    createdAt: string;
    object: {
      name: string;
      type: string;
    };
  };
}

export default function RecentAuditsList({ audits }: { audits: Audit[] }) {
    return (
      <div className="bg-black p-4 rounded shadow mb-8 border">
        <h3 className="text-lg font-semibold mb-4">Les derniers élèves auditionnés</h3>
        {audits.length > 0 ? (
          <div className="space-y-4">
            {audits.slice(0, 3).map((audit, idx) => (
              <div
                key={idx}
                className="p-3 bg-black rounded-lg hover:bg-blue-600 transition border"
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