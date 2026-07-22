import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowLeft, UserPlus, Heart, MessageSquareText, ThumbsUp, Eye } from 'lucide-react';
import { getAuthSession } from './authSession';
import { getNotifications, markNotificationsRead, markAllNotificationsRead } from './filmateApi';
import { Header } from './Header';

const PAGE_SIZE = 20;

const formatTime = (dateStr) => {
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
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

const eventIcon = {
  SEGUIDOR_RECIBIDO: UserPlus,
  LIKE_RESENA_RECIBIDO: ThumbsUp,
  COMENTARIO_RESENA: MessageSquareText,
  VISITA_PERFIL: Eye,
};

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const auth = getAuthSession();
  const userId = auth?.user?.id_usuario || auth?.user?.id;
  const navigate = useNavigate();

  const loadNotifications = useCallback(async (append = false) => {
    if (!userId) return;
    const offset = append ? notifications.length : 0;
    try {
      const data = await getNotifications(userId, PAGE_SIZE, offset);
      if (data) {
        setNotifications((prev) => append ? [...prev, ...(data.notifications || [])] : (data.notifications || []));
        setUnreadCount(data.unread_count || 0);
        if ((data.notifications || []).length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userId, notifications.length]);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead(userId).catch(() => {});
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const handleNotificationClick = (notif) => {
    if (!notif.leida) {
      markNotificationsRead(userId, [notif.id_actividad]).catch(() => {});
    }
    if (notif.id_referencia_resena) {
      navigate(`/social/resena/${notif.id_referencia_resena}`);
    } else if (notif.actor_id) {
      navigate(`/social/perfil/${notif.actor_id}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/social')}
              className="rounded-full p-2 text-slate-300 transition-colors hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white">Notificaciones</h1>
              {unreadCount > 0 && (
                <p className="text-sm font-semibold text-sky-300">{unreadCount} sin leer</p>
              )}
            </div>
          </div>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-500/10 px-4 py-2 text-sm font-bold text-sky-300 transition-colors hover:bg-sky-500/20"
            >
              <CheckCheck className="h-4 w-4" />
              Limpiar todo
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Bell className="mb-4 h-12 w-12" />
            <p className="text-lg font-bold">No tienes notificaciones</p>
            <p className="mt-1 text-sm">Tus notificaciones aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notif) => {
              const Icon = eventIcon[notif.tipo_evento] || Bell;
              return (
                <button
                  key={notif.id_actividad}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex w-full items-start gap-4 rounded-xl px-4 py-4 text-left transition-colors hover:bg-slate-800/50 ${
                    !notif.leida ? 'bg-sky-500/5' : ''
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    !notif.leida ? 'bg-sky-500/15 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notif.leida ? 'font-bold text-white' : 'font-semibold text-slate-300'}`}>
                        <span className="font-black">@{notif.actor_username}</span>{' '}
                        {notif.accion}
                      </p>
                      {!notif.leida && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
                      )}
                    </div>
                    {notif.texto_breve && (
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">{notif.texto_breve}</p>
                    )}
                    <p className="mt-1 text-xs font-semibold text-slate-500">{formatTime(notif.fecha)}</p>
                  </div>
                </button>
              );
            })}
            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  type="button"
                  onClick={() => loadNotifications(true)}
                  className="rounded-lg border border-slate-700 px-6 py-2 text-sm font-bold text-sky-300 transition-colors hover:bg-slate-800"
                >
                  Cargar más
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
