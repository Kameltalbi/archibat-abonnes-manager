
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { AdminRoute } from '@/components/auth/AdminRoute';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SessionData {
  id: string;
  user_id: string;
  user_name: string;
  login_time: string;
  logout_time: string;
  duration: string;
}

export default function UserSessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // First get the sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('user_sessions')
          .select('id, user_id, login_time, logout_time')
          .order('login_time', { ascending: false });

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError);
          setError('Erreur lors du chargement des sessions');
          return;
        }

        if (sessionsData && sessionsData.length > 0) {
          // Get unique user IDs
          const userIds = [...new Set(sessionsData.map(s => s.user_id))];
          
          // Get user profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            setError('Erreur lors du chargement des profils utilisateur');
            return;
          }

          // Create a map of user profiles
          const profilesMap = new Map();
          profilesData?.forEach(profile => {
            profilesMap.set(profile.id, profile.full_name);
          });

          // Format the data
          const formatted = sessionsData.map((s: any) => {
            const login = new Date(s.login_time);
            const logout = s.logout_time ? new Date(s.logout_time) : null;
            const duration = logout
              ? `${Math.round((logout.getTime() - login.getTime()) / 60000)} min`
              : 'En cours';

            return {
              id: s.id,
              user_id: s.user_id,
              user_name: profilesMap.get(s.user_id) || 'Utilisateur inconnu',
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom Utilisateur</TableHead>
                  <TableHead>Connexion</TableHead>
                  <TableHead>Déconnexion</TableHead>
                  <TableHead>Durée</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length > 0 ? (
                  sessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.user_name}</TableCell>
                      <TableCell>{s.login_time}</TableCell>
                      <TableCell>{s.logout_time}</TableCell>
                      <TableCell>{s.duration}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Aucune session trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
