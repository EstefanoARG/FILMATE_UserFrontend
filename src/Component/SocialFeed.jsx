import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Star, Users, ChevronLeft } from 'lucide-react';
import { getAuthSession } from './authSession';
import { getSocialFeed } from './filmateApi';
import TrendingMovies from './TrendingMovies';
import SuggestedUsers from './SuggestedUsers';
import Header from './Header.jsx';

const renderStars = (rating) => {
  if (!rating) return null;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

const ReviewCard = ({ item, onUserClick, onMovieClick, onReviewClick }) => {
  const [liked, setLiked] = useState(item.liked_by_me);
  const [likesCount, setLikesCount] = useState(item.total_likes);
  const [expanded, setExpanded] = useState(false);

  const handleLike = async () => {
    try {
      const { likeMovieReview } = await import('./filmateApi');
      const auth = getAuthSession();
      const likeUserId = auth?.user?.id_usuario || auth?.user?.id;
      if (!likeUserId) return;
      const result = await likeMovieReview(item.id, likeUserId);
      setLiked(result.liked_by_me);
      setLikesCount(result.total_likes);
    } catch {
      // fallo silencioso
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-slate-700/30 px-4 py-3">
        <button
          type="button"
          onClick={() => onUserClick(item.id_usuario)}
          className="flex items-center gap-3"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-700">
            {item.url_perfil ? (
              <img src={item.url_perfil} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-300">
                {item.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <span className="text-sm font-bold text-white">@{item.username}</span>
        </button>
        <span className="ml-auto text-xs text-slate-500">{formatDate(item.fecha)}</span>
      </div>

      <button
        type="button"
        onClick={() => onMovieClick(item.pelicula?.id_pelicula)}
        className="flex gap-4 px-4 py-3 transition-colors hover:bg-slate-800/50"
      >
        <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-700">
          {item.pelicula?.url_poster && (
            <img src={item.pelicula.url_poster} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white text-left">{item.pelicula?.titulo || 'Película'}</h3>
          {item.puntuacion_estrellas && (
            <div className="mt-1">{renderStars(item.puntuacion_estrellas)}</div>
          )}
          {item.comentario && (
            <>
              <p className={`mt-2 text-sm text-slate-300 ${!expanded ? 'line-clamp-6' : ''}`}>
                {item.comentario}
              </p>
              {item.comentario.length > 300 && !expanded && (
                <button
                  type="button"
                  onClick={() => onReviewClick(item.id)}
                  className="mt-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Ver reseña completa
                </button>
              )}
            </>
          )}
        </div>
      </button>

        <div className="flex items-center gap-4 border-t border-slate-700/30 px-4 py-2.5">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-400' : ''}`} />
            {likesCount || ''}
          </button>
          <button
            type="button"
            onClick={() => onReviewClick(item.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-sky-400"
          >
            <MessageCircle className="h-4 w-4" />
            {item.total_comentarios || ''}
          </button>
        </div>
    </div>
  );
};

const ActivityCard = ({ item, onUserClick }) => {
  let icon = '📌';
  switch (item.tipo_evento) {
    case 'COMPRA':
      icon = '🎟️';
      break;
    case 'VISTA':
      icon = '👁️';
      break;
    case 'LIKE_RESENA_RECIBIDO':
      icon = '❤️';
      break;
    case 'RESENA_PUBLICADA':
      icon = '⭐';
      break;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-700/30 bg-slate-800/20 px-4 py-3 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onUserClick(item.id_usuario)}
        className="flex shrink-0"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700">
          {item.url_perfil ? (
            <img src={item.url_perfil} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-300">
              {item.username?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-300">
          <span className="font-bold text-white">@{item.username}</span>
          {' '}
          {item.texto_breve || item.tipo_evento}
          {item.referencia_pelicula_titulo && (
            <span className="font-semibold text-sky-300"> {item.referencia_pelicula_titulo}</span>
          )}
        </p>
        <span className="mt-0.5 block text-xs text-slate-600">{formatDate(item.fecha)}</span>
      </div>
      <span className="shrink-0 text-lg">{icon}</span>
    </div>
  );
};

export const SocialFeed = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('feed');

  const auth = getAuthSession();
  const userId = auth?.user?.id_usuario || auth?.user?.id;
  const userProfile = auth?.user;

  useEffect(() => {
    if (!userId) return;

    let active = true;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect

    getSocialFeed(userId).then((items) => {
      if (!active) return;
      setFeedItems(items);
      setLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
    }).catch((err) => {
      if (!active) return;
      setError(err?.message || 'No se pudo cargar el feed');
      setLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
    });

    return () => { active = false; };
  }, [userId]);

  const handleUserClick = (targetUserId) => {
    navigate(`/social/perfil/${targetUserId}`);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/social/pelicula/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20">
      <div className="fixed left-0 right-0 top-0 z-50">
        <Header />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="lg:pr-[312px]">
          <h1 className="mb-6 text-2xl font-black text-white">Feed</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-700" />
                  <div className="h-4 w-24 rounded bg-slate-700" />
                </div>
                <div className="flex gap-4">
                  <div className="h-24 w-16 rounded-lg bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-slate-700" />
                    <div className="h-3 w-1/2 rounded bg-slate-700" />
                    <div className="h-3 w-full rounded bg-slate-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
            {error}
          </div>
        ) : feedItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-10 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-slate-500" />
            <p className="text-lg font-bold text-white">Tu feed está vacío</p>
            <p className="mt-1 text-sm text-slate-400">
              Sigue a otros usuarios para ver sus reseñas y actividad aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item) => (
              item.type === 'review' ? (
                <ReviewCard
                  key={`review-${item.id}`}
                  item={item}
                  onUserClick={handleUserClick}
                  onMovieClick={handleMovieClick}
                  onReviewClick={(id) => navigate(`/social/resena/${id}`)}
                />
              ) : (
                <ActivityCard
                  key={`activity-${item.id_actividad}`}
                  item={item}
                  onUserClick={handleUserClick}
                />
              )
            ))}
          </div>
        )}
        </div>
      </div>

      <aside
        className="hidden fixed top-28 w-[280px] lg:block"
        style={{ right: 'max(24px, calc(50vw - 552px))' }}
      >
        <div className="space-y-8">
          <TrendingMovies />
          <SuggestedUsers />
        </div>
      </aside>
    </div>
  );
};

export default SocialFeed;
