import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser'; // à adapter

export default function UserSessionsPage() {
  const { user } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('id, user_id, login_time, logout_time, auth.users(email)')
        .order('login_time', { ascending: false });

      if (data) {
        const formatted = data.map((s: any) => {
          const login = new Date(s.login_time);
          const logout = s.logout_time ? new Date(s.logout_time) : null;
          const duration = logout
            ? `${Math.round((logout.getTime() - login.getTime()) / 60000)} min`
            : 'En cours';

          return {
            id: s.id,
            email: s.auth?.users?.email || 'Inconnu',
            login_time: format(login, 'Pp'),
            logout_time: logout ? format(logout, 'Pp') : '—',
            duration,
          };
        });
        setSessions(formatted);
      }

      setLoading(false);
    };

    fetchSessions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suivi des connexions utilisateur</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Utilisateur</th>
              <th className="border p-2">Connexion</th>
              <th className="border p-2">Déconnexion</th>
              <th className="border p-2">Durée</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: any) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border p-2">{s.email}</td>
                <td className="border p-2">{s.login_time}</td>
                <td className="border p-2">{s.logout_time}</td>
                <td className="border p-2">{s.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

