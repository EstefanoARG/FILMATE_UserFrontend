import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { getAuthSession } from './authSession';
import { getNotifications, markNotificationsRead, markAllNotificationsRead } from './filmateApi';

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
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

export default function NotificationBell({ variant = 'header' }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuthSession();
  const userId = auth?.user?.id_usuario || auth?.user?.id;

  const fetchNotifications = useCallback(() => {
    if (!userId) return;
    getNotifications(userId, 10).then((data) => {
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    }).catch(() => {});
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      const unreadIds = notifications.filter((n) => !n.leida).map((n) => n.id_actividad);
      if (unreadIds.length) {
        markNotificationsRead(userId, unreadIds).catch(() => {});
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
      }
    } else {
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead(userId).catch(() => {});
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const handleNotificationClick = (notif) => {
    setOpen(false);
    if (notif.id_referencia_resena) {
      navigate(`/social/resena/${notif.id_referencia_resena}`);
    } else if (notif.actor_id) {
      navigate(`/social/perfil/${notif.actor_id}`);
    }
  };

  const buttonClass = variant === 'menu'
    ? 'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold text-slate-100 transition-colors hover:bg-slate-800'
    : 'relative rounded-full p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={buttonClass}
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {variant !== 'menu' && unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {variant === 'menu' && (
          <>
            <span className="flex-1">Notificaciones</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-black text-red-300">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {open && variant !== 'menu' && (
        <div className="absolute right-0 top-full z-[70] mt-2 w-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
            <p className="text-sm font-bold text-white">Notificaciones</p>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-sky-400 transition-colors hover:text-sky-300"
              >
                Limpiar todo
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id_actividad}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-800/50 ${
                    !notif.leida ? 'bg-sky-500/5' : ''
                  }`}
                >
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-700">
                    {notif.actor_avatar ? (
                      <img src={notif.actor_avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                        {notif.actor_username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200">
                      <span className="font-bold">@{notif.actor_username}</span>{' '}
                      {notif.accion}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{formatTime(notif.fecha)}</p>
                  </div>
                  {!notif.leida && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
