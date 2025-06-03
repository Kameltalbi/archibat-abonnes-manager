
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
        const { data, error } = await supabase
          .from('user_sessions')
          .select(`
            id, 
            user_id, 
            login_time, 
            logout_time,
            profiles!inner(full_name)
          `)
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
              user_name: s.profiles?.full_name || 'Utilisateur inconnu',
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
