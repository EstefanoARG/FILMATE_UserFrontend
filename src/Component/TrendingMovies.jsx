import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { getAuthSession } from './authSession';
import { getTrendingMovies } from './filmateApi';

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const auth = getAuthSession();
  const userId = auth?.user?.id_usuario || auth?.user?.id;

  useEffect(() => {
    getTrendingMovies(5, userId).then(setMovies).catch(() => {});
  }, [userId]);

  if (!movies.length) return null;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-400" />
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Tendencias</h3>
      </div>
      <div className="space-y-2">
        {movies.map((movie, i) => {
          const rank = i + 1;
          const flameClass = rank === 1
            ? 'h-5 w-5 fill-orange-400 text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]'
            : rank <= 3
              ? 'h-4 w-4 fill-orange-500/60 text-orange-500'
              : rank === 4
                ? 'h-3.5 w-3.5 text-orange-600'
                : 'h-3 w-3 text-slate-600';
          return (
            <button
              key={movie.id_pelicula}
              type="button"
              onClick={() => navigate(`/social/pelicula/${movie.id_pelicula}`)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-800/50"
            >
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                {movie.url_poster ? (
                  <img src={movie.url_poster} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-600">?</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-100">{movie.titulo}</p>
                <p className="text-xs text-slate-500">{movie.anio_lanzamiento}</p>
              </div>
              <Flame className={`shrink-0 ${flameClass}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
