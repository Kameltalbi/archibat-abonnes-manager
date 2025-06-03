
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { AdminRoute } from '@/components/auth/AdminRoute';

export default function UserSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('user_sessions')
          .select('id, user_id, login_time, logout_time')
          .order('login_time', { ascending: false });

        if (error) {
          console.error('Error fetching sessions:', error);
          setError('Erreur lors du chargement des sessions');
          return;
        }

        if (data) {
          const formatted = data.map((s: any) => {
            const login = new Date(s.login_time);
            const logout = s.logout_time ? new Date(s.logout_time) : null;
            const duration = logout
              ? `${Math.round((logout.getTime() - login.getTime()) / 60000)} min`
              : 'En cours';

            return {
              id: s.id,
              user_id: s.user_id,
              login_time: format(login, 'dd/MM/yyyy HH:mm:ss'),
              logout_time: logout ? format(logout, 'dd/MM/yyyy HH:mm:ss') : '—',
              duration,
            };
          });
          setSessions(formatted);
        }
      } catch (error) {
        console.error('Error in fetchSessions:', error);
        setError('Erreur lors du chargement des sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <AdminRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Suivi des connexions utilisateur</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">ID Utilisateur</th>
                  <th className="border p-2 text-left">Connexion</th>
                  <th className="border p-2 text-left">Déconnexion</th>
                  <th className="border p-2 text-left">Durée</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map((s: any) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-xs">{s.user_id}</td>
                      <td className="border p-2">{s.login_time}</td>
                      <td className="border p-2">{s.logout_time}</td>
                      <td className="border p-2">{s.duration}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border p-4 text-center text-gray-500">
                      Aucune session trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
