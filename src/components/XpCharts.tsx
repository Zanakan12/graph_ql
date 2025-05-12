import { useEffect, useRef, useState } from 'react';

interface Transaction {
  amount: number;
  createdAt: string;
  path: string;
}

export function XpOverTimeChart({ transactions }: { transactions: Transaction[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        setDimensions({ width: clientWidth, height: 300 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (dimensions.width === 0 || transactions.length === 0) {
    return <div ref={containerRef} className="h-64">Chargement du graphique...</div>;
  }

  const sorted = [...transactions].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  let cumulative = 0;
  const points = sorted.map((tx) => {
    cumulative += tx.amount;
    return { x: new Date(tx.createdAt).getTime(), y: cumulative };
  });

  const minX = points[0].x;
  const maxX = points[points.length - 1].x;
  const maxY = Math.max(...points.map((p) => p.y));

  const scaleX = (x: number) => {
    return ((x - minX) / (maxX - minX)) * dimensions.width;
  };

  const scaleY = (y: number) => {
    return dimensions.height - (y / maxY) * dimensions.height;
  };

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${scaleX(p.x)},${scaleY(p.y)}`).join(' ');

  return (
    <div ref={containerRef} className="bg-gray-800 p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4 text-center">Progression XP dans le Temps</h3>
      <svg width={dimensions.width} height={dimensions.height}>
        <path d={pathData} stroke="cyan" fill="none" strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y)} r={3} fill="cyan" />
        ))}
      </svg>
    </div>
  );
}

export function XpBarChart({ transactions }: { transactions: Transaction[] }) {
  const topTransactions = [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const maxAmount = Math.max(...topTransactions.map((tx) => tx.amount));

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4 text-center">Distribution XP par Projet</h3>
      <svg width="100%" height={300} viewBox={`0 0 ${topTransactions.length * 60} 300`}>
        {topTransactions.map((tx, idx) => {
          const height = (tx.amount / maxAmount) * 250;
          const x = idx * 60 + 20;
          const y = 280 - height;
          return (
            <g key={idx}>
              <rect x={x} y={y} width={40} height={height} fill="teal" />
              <text x={x + 20} y={295} fontSize={10} textAnchor="middle" fill="white">
                {tx.path.length > 10 ? tx.path.slice(0, 10) + '…' : tx.path}
              </text>
              <text x={x + 20} y={y - 5} fontSize={10} textAnchor="middle" fill="white">
                {tx.amount}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
