// AuditRatioCard.tsx
interface UserInfo {
  totalUp: number;
  totalDown: number;
}

export default function AuditRatioCard({ userInfo }: { userInfo: UserInfo }) {

    const ratio = userInfo ? (userInfo.totalUp / userInfo.totalDown).toFixed(2) : null;
    const progressWidth = userInfo
      ? Math.min((userInfo.totalUp / userInfo.totalDown) * 100, 100)
      : 0;
    const barColor = userInfo
      ? userInfo.totalUp / userInfo.totalDown > 1
        ? 'bg-green-500'
        : userInfo.totalUp / userInfo.totalDown < 0.5
        ? 'bg-red-500'
        : 'bg-yellow-500'
      : 'bg-gray-500';
  
    return (
      <div className="bg-black p-4 rounded shadow mb-8 w-full border">
        <h3 className="text-lg font-semibold mb-4">Audit Ratio</h3>
        {userInfo ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm bg-black">Ratio global</span>
              <span className="text-xl font-bold text-white">{ratio}</span>
            </div>
            <div className="w-60 bg-white h-4 rounded-full overflow-hidden">
              <div
                className={`h-4 rounded-full ${barColor}`}
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                <strong>{userInfo.totalUp.toLocaleString()} xp d&apos;audits passés</strong> /{' '}
                <strong>{userInfo.totalDown.toLocaleString()} xp d&apos;audits reçus</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Chargement des données...</p>
        )}
      </div>
    );
  }
  