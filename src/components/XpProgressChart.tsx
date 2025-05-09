// XpProgressChart.tsx
import { motion } from 'framer-motion';

export default function XpProgressChart({ transactions }) {
  const width = 500;
  const height = 300;

  const sorted = [...transactions]
    .slice(0, 10)
    .map((tx, idx) => ({
      ...tx,
      date: new Date().getTime() + idx * 86400000,
    }));

  let cumulative = 0;
  const points = sorted.map((tx, i) => {
    cumulative += tx.amount;
    const x = (i / (sorted.length - 1)) * width;
    const y = height - (cumulative / 10000);
    return { x, y, value: cumulative };
  });

  const pathData = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4 text-center">Progression XP dans le Temps</h3>
      <svg width="100%" height="300" className="bg-gray-700 rounded">
        {transactions.length > 0 ? (
          <>
            <motion.path
              d={pathData}
              stroke="cyan"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="cyan" />
                <text
                  x={p.x}
                  y={p.y - 10}
                  fontSize="10"
                  fill="white"
                  textAnchor="middle"
                >
                  {Math.round(p.value)}
                </text>
              </g>
            ))}
          </>
        ) : (
          <text x="50%" y="50%" fill="white" fontSize="16" textAnchor="middle">
            Aucune donnée XP
          </text>
        )}
      </svg>
    </div>
  );
}
