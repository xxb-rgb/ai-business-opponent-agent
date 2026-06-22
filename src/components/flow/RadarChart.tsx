import type { ScoreItem } from '@/types/agent';

export default function RadarChart({ scores }: { scores: ScoreItem[] }) {
  const size = 260;
  const center = size / 2;
  const maxRadius = 88;

  const points = scores.map((item, index) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const radius = (item.score / 100) * maxRadius;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 30),
      labelY: center + Math.sin(angle) * (maxRadius + 30),
      label: item.label.replace('度', ''),
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const ring = scores
          .map((_, index) => {
            const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
            const radius = maxRadius * scale;
            return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
          })
          .join(' ');
        return <polygon key={scale} points={ring} fill="none" stroke="#dbe3f0" strokeWidth="1" />;
      })}

      {scores.map((_, index) => {
        const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * maxRadius}
            y2={center + Math.sin(angle) * maxRadius}
            stroke="#dbe3f0"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="rgba(79,70,229,0.18)"
        stroke="#4f46e5"
        strokeWidth="3"
      />

      {points.map((point) => (
        <circle key={point.label} cx={point.x} cy={point.y} r="4" fill="#4f46e5" />
      ))}

      {points.map((point) => (
        <text
          key={`${point.label}-label`}
          x={point.labelX}
          y={point.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill="#334155"
          fontWeight="700"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}
