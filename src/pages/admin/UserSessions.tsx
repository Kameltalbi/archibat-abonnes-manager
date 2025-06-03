
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { PageHeader } from '@/components/common/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Clock } from 'lucide-react';

interface Session {
  id: string;
  email: string;
  login_time: string;
  logout_time: string;
  duration: string;
  user_role: string;
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

      // Récupérer les profils pour les emails et rôles
      const userIds = [...new Set(sessionsData.map(s => s.user_id))];
      console.log('👥 IDs utilisateurs uniques:', userIds.length);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id, 
          email,
          roles (
            name
          )
        `)
        .in('id', userIds);

      if (profilesError) {
        console.error('❌ Erreur chargement profils :', profilesError);
      }

      console.log('📇 Profils récupérés:', profilesData?.length || 0);

      // Créer un map des emails et rôles par user_id
      const userMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          userMap.set(profile.id, {
            email: profile.email,
            role: profile.roles?.name || 'Inconnu'
          });
        });
      }

      // Filtrer pour exclure les sessions des administrateurs
      const nonAdminSessions = sessionsData.filter(session => {
        const userData = userMap.get(session.user_id);
        return userData && userData.role !== 'Admin';
      });

      console.log('📊 Sessions après filtrage (sans admins):', nonAdminSessions.length);

      const formatted = nonAdminSessions.map((s: any) => {
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

        const userData = userMap.get(s.user_id);

        return {
          id: s.id,
          email: userData?.email || 'Email non trouvé',
          user_role: userData?.role || 'Rôle inconnu',
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
    <div className="p-6 space-y-6">
      <PageHeader
        title="Suivi des connexions utilisateur"
        description="Surveillance des sessions des utilisateurs non-administrateurs"
        icon={<Users className="w-6 h-6" />}
      />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Clock className="w-6 h-6 animate-spin mr-2" />
          <span>Chargement des sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2 font-medium">Aucune session trouvée</p>
          <p className="text-sm text-gray-400">
            Les sessions des utilisateurs non-administrateurs apparaîtront ici une fois qu'ils se connecteront à l'application.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Note : Les connexions des administrateurs ne sont pas suivies.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Utilisateur</TableHead>
                <TableHead className="font-semibold">Rôle</TableHead>
                <TableHead className="font-semibold">Heure de connexion</TableHead>
                <TableHead className="font-semibold">Heure de déconnexion</TableHead>
                <TableHead className="font-semibold">Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{session.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {session.user_role}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{session.login_time}</TableCell>
                  <TableCell className="text-sm">{session.logout_time}</TableCell>
                  <TableCell className="text-sm font-medium">{session.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Total : {sessions.length} session(s) d'utilisateurs non-administrateurs</span>
              <span className="text-xs text-gray-500">
                🛡️ Les connexions administrateurs ne sont pas surveillées
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
