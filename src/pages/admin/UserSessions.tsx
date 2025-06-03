
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

interface Session {
  id: string;
  email: string;
  login_time: string;
  logout_time: string;
  duration: string;
}

export default function UserSessionsPage() {
  const { isAdmin, userRole, isLoading } = useUserRole();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('UserSessions - isAdmin:', isAdmin);
  console.log('UserSessions - userRole:', userRole);
  console.log('UserSessions - isLoading:', isLoading);

  useEffect(() => {
    const fetchSessions = async () => {
      console.log('🔍 Début du chargement des sessions...');
      
      // Première requête pour récupérer toutes les sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .order('login_time', { ascending: false });

      if (sessionsError) {
        console.error('❌ Erreur chargement sessions :', sessionsError);
        setSessions([]);
        setLoading(false);
        return;
      }

      console.log('📊 Sessions récupérées:', sessionsData?.length || 0);
      console.log('📋 Première session exemple:', sessionsData?.[0]);

      if (!sessionsData || sessionsData.length === 0) {
        console.log('⚠️ Aucune session trouvée dans la base de données');
        setSessions([]);
        setLoading(false);
        return;
      }

      // Récupérer les profils pour les emails
      const userIds = [...new Set(sessionsData.map(s => s.user_id))];
      console.log('👥 IDs utilisateurs uniques:', userIds.length);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profilesError) {
        console.error('❌ Erreur chargement profils :', profilesError);
      }

      console.log('📇 Profils récupérés:', profilesData?.length || 0);

      // Créer un map des emails par user_id
      const emailMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          emailMap.set(profile.id, profile.email);
        });
      }

      const formatted = sessionsData.map((s: any) => {
        const login = new Date(s.login_time);
        const logout = s.logout_time ? new Date(s.logout_time) : null;

        let duration = 'En cours';
        if (logout) {
          const diffMs = logout.getTime() - login.getTime();
          const totalMinutes = Math.floor(diffMs / (1000 * 60));
          
          if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            duration = `${hours}h ${minutes}min`;
          } else {
            duration = `${totalMinutes} min`;
          }
        }

        const email = emailMap.get(s.user_id) || 'Email non trouvé';

        return {
          id: s.id,
          email,
          login_time: format(login, 'dd/MM/yyyy HH:mm:ss'),
          logout_time: logout ? format(logout, 'dd/MM/yyyy HH:mm:ss') : '—',
          duration,
        };
      });

      console.log('✅ Sessions formatées:', formatted.length);
      console.log('📋 Première session formatée:', formatted[0]);

      setSessions(formatted);
      setLoading(false);
    };

    // Ne charger les données que si l'utilisateur est admin
    if (!isLoading && isAdmin) {
      fetchSessions();
    } else if (!isLoading && !isAdmin) {
      setLoading(false);
    }
  }, [isAdmin, isLoading]);

  // Attendre que le chargement soit terminé avant de rediriger
  if (isLoading) {
    return <div className="p-6">Chargement des permissions...</div>;
  }

  if (!isAdmin) {
    console.log('Redirection vers dashboard - pas admin');
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suivi des connexions utilisateur</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucune session trouvée</p>
          <p className="text-sm text-gray-400">
            Les sessions des utilisateurs apparaîtront ici une fois qu'ils se connecteront à l'application.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
          <div className="mt-4 text-sm text-gray-500">
            Total : {sessions.length} session(s)
          </div>
        </div>
      )}
    </div>
  );
}
