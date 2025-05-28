
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface SessionData {
  id: string;
  user_id: string;
  login_time: string;
  logout_time: string | null;
  status: string;
  device: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface InactivityData {
  id: string;
  session_id: string;
  start_idle: string;
  end_idle: string | null;
  duration_minutes: number | null;
}

interface PerformanceStats {
  totalActiveTime: number;
  totalInactiveTime: number;
  sessionsCount: number;
  averageSessionTime: number;
}

export const usePerformanceData = (dateFrom?: string, dateTo?: string) => {
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['user-sessions', dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('user_sessions')
        .select('*')
        .order('login_time', { ascending: false });

      if (dateFrom) {
        query = query.gte('login_time', dateFrom);
      }
      if (dateTo) {
        query = query.lte('login_time', dateTo);
      }

      const { data: sessionsData, error } = await query;
      if (error) throw error;

      // Récupérer les profiles séparément
      if (sessionsData && sessionsData.length > 0) {
        const userIds = [...new Set(sessionsData.map(s => s.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        // Joindre les données
        const sessionsWithProfiles = sessionsData.map(session => ({
          ...session,
          profiles: profilesData?.find(p => p.id === session.user_id) || null
        }));

        return sessionsWithProfiles as SessionData[];
      }

      return sessionsData as SessionData[];
    },
  });

  const { data: inactivityData } = useQuery({
    queryKey: ['user-inactivity', sessions?.map(s => s.id)],
    queryFn: async () => {
      if (!sessions?.length) return [];
      
      const sessionIds = sessions.map(s => s.id);
      const { data, error } = await supabase
        .from('user_inactivity')
        .select('*')
        .in('session_id', sessionIds);

      if (error) throw error;
      return data as InactivityData[];
    },
    enabled: !!sessions?.length,
  });

  const calculateStats = (): PerformanceStats => {
    if (!sessions || !inactivityData) {
      return {
        totalActiveTime: 0,
        totalInactiveTime: 0,
        sessionsCount: 0,
        averageSessionTime: 0,
      };
    }

    let totalActiveTime = 0;
    let totalInactiveTime = 0;

    sessions.forEach(session => {
      const loginTime = new Date(session.login_time);
      const logoutTime = session.logout_time ? new Date(session.logout_time) : new Date();
      const sessionDuration = (logoutTime.getTime() - loginTime.getTime()) / 60000; // en minutes

      const sessionInactivity = inactivityData
        .filter(i => i.session_id === session.id)
        .reduce((sum, i) => sum + (i.duration_minutes || 0), 0);

      totalActiveTime += Math.max(0, sessionDuration - sessionInactivity);
      totalInactiveTime += sessionInactivity;
    });

    return {
      totalActiveTime,
      totalInactiveTime,
      sessionsCount: sessions.length,
      averageSessionTime: sessions.length > 0 ? totalActiveTime / sessions.length : 0,
    };
  };

  const getSessionsByUser = () => {
    if (!sessions || !inactivityData) return [];

    const userMap = new Map();

    sessions.forEach(session => {
      const userId = session.user_id;
      const userName = session.profiles?.full_name || session.profiles?.email || 'Utilisateur inconnu';
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user_id: userId,
          name: userName,
          sessions: [],
          totalActiveTime: 0,
          totalInactiveTime: 0,
        });
      }

      const loginTime = new Date(session.login_time);
      const logoutTime = session.logout_time ? new Date(session.logout_time) : new Date();
      const sessionDuration = (logoutTime.getTime() - loginTime.getTime()) / 60000;

      const sessionInactivity = inactivityData
        .filter(i => i.session_id === session.id)
        .reduce((sum, i) => sum + (i.duration_minutes || 0), 0);

      const activeTime = Math.max(0, sessionDuration - sessionInactivity);

      const userData = userMap.get(userId);
      userData.sessions.push({
        ...session,
        activeTime,
        inactiveTime: sessionInactivity,
      });
      userData.totalActiveTime += activeTime;
      userData.totalInactiveTime += sessionInactivity;
    });

    return Array.from(userMap.values());
  };

  return {
    sessions,
    inactivityData,
    stats: calculateStats(),
    sessionsByUser: getSessionsByUser(),
    isLoading: sessionsLoading,
  };
};
