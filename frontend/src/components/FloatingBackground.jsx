// Ambient, decorative layer: soft drifting "spice dust" blobs + a few
// floating food glyphs. Pure CSS animation (see tailwind.config.js
// `floaty` / `floatySlow` keyframes) so it costs nothing at runtime.
const GLYPHS = ["🌶️", "🍋", "🧄", "🌿", "🍚", "🥥"];

export default function FloatingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft color blobs */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-saffron/20 dark:bg-saffron/10 blur-3xl animate-floatySlow" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-chili/15 dark:bg-chili/10 blur-3xl animate-floaty" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-basil/15 dark:bg-basil/10 blur-3xl animate-floatySlow" />

      {/* drifting glyphs */}
      {GLYPHS.map((g, i) => (
        <span
          key={g}
          className="absolute select-none opacity-20 dark:opacity-15 text-4xl animate-floaty"
          style={{
            top: `${(i * 37) % 90}%`,
            left: `${(i * 53 + 10) % 90}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + (i % 4)}s`,
          }}
          aria-hidden="true"
        >
          {g}
        </span>
      ))}
    </div>
  );
}
