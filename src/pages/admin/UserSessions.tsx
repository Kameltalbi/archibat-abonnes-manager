import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // ajuste si tu n'utilises pas @
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser'; // adapte si besoin

interface Session {
  id: string;
  email: string;
  login_time: string;
  logout_time: string;
  duration: string;
}

export default function UserSessionsPage() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
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

      if (error) {
        console.error('Erreur chargement sessions :', error);
        setSessions([]);
        setLoading(false);
        return;
      }

      const formatted = data.map((s: any) => {
        const login = new Date(s.login_time);
        const logout = s.logout_time ? new Date(s.logout_time) : null;

        let duration = 'En cours';
        if (logout) {
          const diffMs = logout.getTime() - login.getTime();
          const totalSeconds = Math.floor(diffMs / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          duration = `${minutes} min ${seconds} sec`;
        }

        return {
          id: s.id,
          email: s.auth?.users?.email || 'Inconnu',
          login_time: format(login, 'dd/MM/yyyy HH:mm:ss'),
          logout_time: logout ? format(logout, 'dd/MM/yyyy HH:mm:ss') : '—',
          duration,
        };
      });

      setSessions(formatted);
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
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Utilisateur</th>
              <th className="p-2 border">Heure de connexion</th>
              <th className="p-2 border">Heure de déconnexion</th>
              <th className="p-2 border">Durée</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">{s.login_time}</td>
                <td className="p-2 border">{s.logout_time}</td>
                <td className="p-2 border">{s.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
