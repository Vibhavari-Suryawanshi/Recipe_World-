export default function SteamLoader({ label }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <div className="relative h-16 w-20 grid place-items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute bottom-6 h-2 w-2 rounded-full bg-saffron animate-bubble"
            style={{ left: `${30 + i * 18}%`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
        <span className="text-4xl">🍲</span>
      </div>
      {label && (
        <p className="font-mono text-sm text-ink/60 dark:text-steam/60">{label}</p>
      )}
    </div>
  );
}
