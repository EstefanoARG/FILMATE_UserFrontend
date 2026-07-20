import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';
import { getAuthSession } from './authSession';
import { getSuggestedUsers, followUser } from './filmateApi';

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const auth = getAuthSession();
  const userId = auth?.user?.id_usuario || auth?.user?.id;

  useEffect(() => {
    if (!userId) return;
    getSuggestedUsers(userId, 5).then(setUsers).catch(() => {});
  }, [userId]);

  if (!users.length) return null;

  const handleFollow = async (targetUserId) => {
    try {
      await followUser(userId, targetUserId);
      setUsers((prev) => prev.filter((u) => u.id_usuario !== targetUserId));
    } catch {
      // silencio
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-5 w-5 text-sky-400" />
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Sugerencias</h3>
      </div>
      <div className="space-y-1">
        {users.map((user) => (
          <div
            key={user.id_usuario}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-800/50"
          >
            <button
              type="button"
              onClick={() => navigate(`/social/perfil/${user.id_usuario}`)}
              className="flex shrink-0 items-center gap-3 overflow-hidden"
            >
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-700">
                {user.url_perfil ? (
                  <img src={user.url_perfil} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                    {user.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
            </button>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => navigate(`/social/perfil/${user.id_usuario}`)}
                className="truncate text-sm font-bold text-slate-100 hover:text-sky-300"
              >
                @{user.username}
              </button>
              <p className="truncate text-xs text-slate-500">{user.reason}</p>
            </div>
            <button
              type="button"
              onClick={() => handleFollow(user.id_usuario)}
              className="flex shrink-0 items-center gap-1 rounded-full bg-sky-500/15 px-3 py-1.5 text-xs font-bold text-sky-300 transition-colors hover:bg-sky-500/25"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Seguir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
