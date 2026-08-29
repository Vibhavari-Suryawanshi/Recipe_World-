import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";

export default function RecipeCard({ recipe }) {
  const { id, title, image, readyInMinutes, servings } = recipe;

  return (
    <Link
      to={`/recipe/${id}`}
      className="group relative block rounded-3xl overflow-hidden bg-white/70 dark:bg-white/5
                 border border-ink/10 dark:border-white/10 shadow-sm hover:shadow-xl
                 hover:-translate-y-1.5 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full grid place-items-center bg-saffron/20 text-4xl">🍽️</div>
        )}

        {/* steam that rises off the card on hover — the site's signature motif */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 opacity-0 group-hover:opacity-100 transition-opacity">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute top-2 h-5 w-2 rounded-full bg-white/70 blur-[1px] animate-riseFade"
              style={{ left: `${30 + i * 18}%`, animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-medium leading-snug line-clamp-2">{title}</h3>
        <div className="mt-2 flex items-center gap-4 text-xs font-mono text-ink/60 dark:text-steam/60">
          {readyInMinutes != null && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> {readyInMinutes}m
            </span>
          )}
          {servings != null && (
            <span className="flex items-center gap-1">
              <Users size={13} /> {servings}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
