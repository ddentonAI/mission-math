export function ArcadeSpace() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <span
          key={i}
          className="arcade-star"
          style={{
            left: `${(i * 41 + 7) % 96}%`,
            top: `${(i * 27 + 9) % 90}%`,
            width: i % 6 === 0 ? 4 : 2,
            height: i % 6 === 0 ? 4 : 2,
            animationDelay: `${(i % 7) * 0.28}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SparkBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="spark-arm" style={{ transform: `rotate(${i * 26}deg)` }}>
          <span className="spark-dot" />
        </span>
      ))}
    </div>
  );
}
