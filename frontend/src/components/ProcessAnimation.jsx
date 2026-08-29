// Small, self-contained animated glyphs that illustrate what a cooking
// step is asking you to do. Each is pure CSS (keyframes live in
// tailwind.config.js), so dozens can be on screen without hurting
// performance. `detectProcess` maps a free-text instruction to a type.

const KEYWORD_MAP = [
  [/boil|simmer|blanch|poach/i, "boil"],
  [/fry|sear|sauté|saute|pan-fry/i, "fry"],
  [/bake|roast|oven/i, "bake"],
  [/chop|dice|mince|slice|cut/i, "chop"],
  [/whisk|beat|mix|stir|blend|fold/i, "whisk"],
  [/grill|char|barbecue|bbq/i, "grill"],
  [/chill|freeze|marinate|rest|refrigerate/i, "chill"],
];

export function detectProcess(text = "") {
  for (const [re, type] of KEYWORD_MAP) {
    if (re.test(text)) return type;
  }
  return "cook";
}

function Bubbles({ n = 3 }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-white/80 animate-bubble"
          style={{ left: `${28 + i * 14}%`, animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </>
  );
}

function Steam({ n = 3 }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="absolute top-1 h-4 w-1.5 rounded-full bg-white/70 animate-riseFade"
          style={{ left: `${32 + i * 16}%`, animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </>
  );
}

const BASE = "relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden grid place-items-center";

export default function ProcessAnimation({ type = "cook", className = "" }) {
  switch (type) {
    case "boil":
      return (
        <div className={`${BASE} bg-basil/15 ${className}`} title="Boiling">
          <Steam />
          <Bubbles />
          <span className="text-2xl">🍲</span>
        </div>
      );
    case "fry":
      return (
        <div className={`${BASE} bg-chili/15 ${className}`} title="Frying">
          <span className="absolute bottom-1 text-lg animate-flicker">🔥</span>
          <span className="text-2xl -translate-y-1">🍳</span>
        </div>
      );
    case "bake":
      return (
        <div className={`${BASE} bg-saffron/20 animate-pulse ${className}`} title="Baking">
          <span className="text-2xl">🧁</span>
        </div>
      );
    case "chop":
      return (
        <div className={`${BASE} bg-ink/5 dark:bg-white/10 ${className}`} title="Chopping">
          <span className="text-2xl inline-block animate-[floaty_1.1s_ease-in-out_infinite]">
            🔪
          </span>
        </div>
      );
    case "whisk":
      return (
        <div className={`${BASE} bg-saffron/15 ${className}`} title="Mixing">
          <span className="text-2xl inline-block animate-spin3d">🥄</span>
        </div>
      );
    case "grill":
      return (
        <div className={`${BASE} bg-chili/15 ${className}`} title="Grilling">
          <span className="absolute bottom-1 text-base animate-flicker">🔥</span>
          <span className="text-2xl -translate-y-1">🍢</span>
        </div>
      );
    case "chill":
      return (
        <div className={`${BASE} bg-basil/10 ${className}`} title="Resting / chilling">
          <span className="text-2xl animate-floatySlow">🧊</span>
        </div>
      );
    default:
      return (
        <div className={`${BASE} bg-ink/5 dark:bg-white/10 ${className}`} title="Cooking">
          <Steam n={2} />
          <span className="text-2xl">🍳</span>
        </div>
      );
  }
}
