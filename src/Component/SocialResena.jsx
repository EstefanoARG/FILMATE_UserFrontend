import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Heart, ChevronLeft, Send, MessageCircle } from 'lucide-react';
import { getAuthSession } from './authSession';
import { getReviewDetail, likeMovieReview, getReviewComments, createReviewComment } from './filmateApi';

const renderStars = (rating) => {
  if (!rating) return null;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} className={`h-5 w-5 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export const SocialResena = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const auth = getAuthSession();
  const userId = auth?.user?.id_usuario || auth?.user?.id;

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    if (!reviewId) return;

    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    let active = true;

    Promise.all([
      getReviewDetail(reviewId, userId),
      getReviewComments(reviewId),
    ]).then(([reviewData, commentsData]) => {
      if (!active) return;
      if (!reviewData) return;
      setReview(reviewData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
      setLiked(reviewData.liked_by_me || false);
      setLikesCount(reviewData.total_likes || 0);
    }).catch(() => {
      // silencio
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [reviewId, userId]);

  const handleLike = async () => {
    if (!reviewId || !userId) return;
    try {
      const result = await likeMovieReview(reviewId, userId);
      setLiked(result.liked_by_me);
      setLikesCount(result.total_likes);
    } catch {
      // silencio
    }
  };

  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text || !reviewId || !userId || sendingComment) return;
    try {
      setSendingComment(true);
      const newComment = await createReviewComment(reviewId, { id_usuario: userId, texto: text });
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch {
      // silencio
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-700" />
              <div className="h-4 w-32 rounded bg-slate-700" />
            </div>
            <div className="h-32 w-full rounded-2xl bg-slate-700" />
          </div>
        ) : !review ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 text-center text-slate-400">
            Reseña no encontrada
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center gap-3 border-b border-slate-700/30 px-4 py-3">
                <button
                  type="button"
                  onClick={() => navigate(`/social/perfil/${review.id_usuario}`)}
                  className="flex items-center gap-3"
                >
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                    {review.url_perfil ? (
                      <img src={review.url_perfil} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-300">
                        {review.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">@{review.username}</p>
                    <p className="text-xs text-slate-500">{formatDate(review.fecha_publicacion)}</p>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/social/pelicula/${review.pelicula?.id_pelicula}`)}
                className="flex w-full gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-800/50"
              >
                <div className="h-32 w-22 shrink-0 overflow-hidden rounded-lg bg-slate-700">
                  {review.pelicula?.url_poster && (
                    <img src={review.pelicula.url_poster} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-white">{review.pelicula?.titulo || 'Película'}</h2>
                  {review.puntuacion_estrellas && (
                    <div className="mt-2">{renderStars(review.puntuacion_estrellas)}</div>
                  )}
                  {review.comentario && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{review.comentario}</p>
                  )}
                </div>
              </button>

              <div className="flex items-center gap-4 border-t border-slate-700/30 px-4 py-2.5">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-red-400' : ''}`} />
                  {likesCount || ''}
                </button>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                  <MessageCircle className="h-5 w-5" />
                  {comments.length || ''}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-base font-bold text-white">Comentarios</h3>

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500">Sin comentarios aún. ¡Sé el primero!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 rounded-xl bg-slate-800/20 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/social/perfil/${comment.userId}`)}
                        className="shrink-0"
                      >
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-300">
                              {comment.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white">@{comment.username}</p>
                        <p className="mt-0.5 text-sm text-slate-300">{comment.text}</p>
                        {comment.createdAt && (
                          <p className="mt-1 text-xs text-slate-600">{formatDate(comment.createdAt)}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                  placeholder="Escribe un comentario..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || sendingComment}
                  className="flex items-center justify-center rounded-xl bg-sky-600 px-4 text-white transition-colors hover:bg-sky-500 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialResena;
