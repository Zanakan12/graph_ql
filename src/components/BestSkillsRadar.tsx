import { motion } from "framer-motion";

export interface Skill {
  name: string;
  value: number;
}

interface BestSkillsRadarProps {
  skills: Skill[];
}

export default function BestSkillsRadar({ skills }: BestSkillsRadarProps) {
  const centerX = 200;
  const centerY = 200;
  const radius = 100;
  const total = skills.length;
  const angleStep = (2 * Math.PI) / total;

  const outerPoints = skills.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const innerPoints = skills.map((skill, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const skillRadius = (skill.value / 100) * radius;
    return {
      x: centerX + skillRadius * Math.cos(angle),
      y: centerY + skillRadius * Math.sin(angle),
    };
  });

  const innerPolygon = innerPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="bg-black rounded shadow mb-8 border">
      <h3 className="text-lg font-semibold mb-4 text-center">Best Skills</h3>
      <svg viewBox="0 0 400 400" width="100%" height="400" className="bg-black rounded">
        {/* Axes */}
        {outerPoints.map((p, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={p.x}
            y2={p.y}
            stroke="gray"
            strokeDasharray="2"
          />
        ))}

        {/* Polygon border */}
        <polygon
          points={outerPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          stroke="gray"
          fill="none"
        />

        {/* Skill polygon */}
        <motion.polygon
          points={innerPolygon}
          fill="rgba(79, 70, 229, 0.5)"
          stroke="purple"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Points + labels */}
        {skills.map((skill, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <circle cx={innerPoints[i].x} cy={innerPoints[i].y} r="4" fill="purple" />
            <text
              x={outerPoints[i].x}
              y={outerPoints[i].y}
              fill="white"
              fontSize="12"
              textAnchor="middle"
              dy={outerPoints[i].y < centerY ? -10 : 15}
            >
              {skill.name} ({skill.value}%)
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
