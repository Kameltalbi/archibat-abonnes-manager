import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, parseISO, isSameDay, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface WorkingHoursStats {
  dailyHours: number;
  weeklyHours: number;
  monthlyHours: number;
  expectedDailyHours: number;
  lunchBreakMinutes: number;
}

interface PerformanceStats {
  totalActiveTime: number;
  totalInactiveTime: number;
  sessionsCount: number;
  averageSessionTime: number;
  workingHoursStats: WorkingHoursStats;
}

const WORK_START_HOUR = 8; // 8h00
const WORK_END_HOUR = 17; // 17h00
const LUNCH_BREAK_MINUTES = 60; // 1 heure de pause déjeuner
const EXPECTED_DAILY_HOURS = 8; // 8 heures par jour (9h - 1h pause)

// Email de l'utilisateur à tracker
const TRACKED_USER_EMAIL = 'aymen.boubakri@gmail.com';

export const usePerformanceData = (dateFrom?: string, dateTo?: string) => {
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['user-sessions', dateFrom, dateTo],
    queryFn: async () => {
      console.log('🔍 Fetching sessions with filters:', { dateFrom, dateTo });
      
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

      console.log('📊 Raw sessions data:', sessionsData);

      // Récupérer les profiles séparément
      if (sessionsData && sessionsData.length > 0) {
        const userIds = [...new Set(sessionsData.map(s => s.user_id))];
        console.log('👥 User IDs found:', userIds);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        console.log('👤 Profiles data:', profilesData);
        if (profilesError) console.error('❌ Profiles error:', profilesError);

        // Joindre les données et filtrer uniquement l'utilisateur Aymen
        const sessionsWithProfiles = sessionsData.map(session => ({
          ...session,
          profiles: profilesData?.find(p => p.id === session.user_id) || null
        })).filter(session => {
          // Filtrer uniquement Aymen Boubakri
          return session.profiles?.email === TRACKED_USER_EMAIL;
        });

        console.log('🔗 Sessions with profiles (filtered for Aymen):', sessionsWithProfiles);
        return sessionsWithProfiles as SessionData[];
      }

      return [] as SessionData[];
    },
  });

  const { data: inactivityData } = useQuery({
    queryKey: ['user-inactivity', sessions?.map(s => s.id)],
    queryFn: async () => {
      if (!sessions?.length) return [];
      
      const sessionIds = sessions.map(s => s.id);
      console.log('⏰ Fetching inactivity for sessions:', sessionIds);
      
      const { data, error } = await supabase
        .from('user_inactivity')
        .select('*')
        .in('session_id', sessionIds);

      if (error) throw error;
      console.log('😴 Inactivity data:', data);
      return data as InactivityData[];
    },
    enabled: !!sessions?.length,
  });

  const calculateWorkingHours = (sessions: SessionData[], inactivityData: InactivityData[]): WorkingHoursStats => {
    if (!sessions || !inactivityData) {
      return {
        dailyHours: 0,
        weeklyHours: 0,
        monthlyHours: 0,
        expectedDailyHours: EXPECTED_DAILY_HOURS,
        lunchBreakMinutes: LUNCH_BREAK_MINUTES,
      };
    }

    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
    const startOfThisMonth = startOfMonth(today);
    const endOfThisMonth = endOfMonth(today);

    let dailyHours = 0;
    let weeklyHours = 0;
    let monthlyHours = 0;

    sessions.forEach(session => {
      const loginTime = parseISO(session.login_time);
      const logoutTime = session.logout_time ? parseISO(session.logout_time) : new Date();
      
      // Calculer les heures dans la plage de travail (8h-17h)
      const workStartTime = new Date(loginTime);
      workStartTime.setHours(WORK_START_HOUR, 0, 0, 0);
      
      const workEndTime = new Date(loginTime);
      workEndTime.setHours(WORK_END_HOUR, 0, 0, 0);

      // Ajuster les heures de connexion/déconnexion aux heures de travail
      const effectiveLoginTime = loginTime < workStartTime ? workStartTime : loginTime;
      const effectiveLogoutTime = logoutTime > workEndTime ? workEndTime : logoutTime;

      if (effectiveLoginTime < effectiveLogoutTime) {
        // Calculer le temps total de session (en minutes)
        const sessionDurationMinutes = differenceInMinutes(effectiveLogoutTime, effectiveLoginTime);
        
        // Soustraire le temps d'inactivité
        const sessionInactivity = inactivityData
          .filter(i => i.session_id === session.id)
          .reduce((sum, i) => sum + (i.duration_minutes || 0), 0);

        // Calculer le temps de travail effectif (en heures)
        const effectiveWorkMinutes = Math.max(0, sessionDurationMinutes - sessionInactivity - LUNCH_BREAK_MINUTES);
        const effectiveWorkHours = effectiveWorkMinutes / 60;

        // Ajouter aux totaux selon la période
        if (isSameDay(loginTime, today)) {
          dailyHours += effectiveWorkHours;
        }

        if (loginTime >= startOfThisWeek && loginTime <= endOfThisWeek) {
          weeklyHours += effectiveWorkHours;
        }

        if (loginTime >= startOfThisMonth && loginTime <= endOfThisMonth) {
          monthlyHours += effectiveWorkHours;
        }
      }
    });

    return {
      dailyHours: Math.round(dailyHours * 100) / 100,
      weeklyHours: Math.round(weeklyHours * 100) / 100,
      monthlyHours: Math.round(monthlyHours * 100) / 100,
      expectedDailyHours: EXPECTED_DAILY_HOURS,
      lunchBreakMinutes: LUNCH_BREAK_MINUTES,
    };
  };

  const calculateStats = (): PerformanceStats => {
    if (!sessions || !inactivityData) {
      return {
        totalActiveTime: 0,
        totalInactiveTime: 0,
        sessionsCount: 0,
        averageSessionTime: 0,
        workingHoursStats: {
          dailyHours: 0,
          weeklyHours: 0,
          monthlyHours: 0,
          expectedDailyHours: EXPECTED_DAILY_HOURS,
          lunchBreakMinutes: LUNCH_BREAK_MINUTES,
        },
      };
    }

    console.log('📈 Calculating stats for sessions:', sessions.length);

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

    const workingHoursStats = calculateWorkingHours(sessions, inactivityData);

    console.log('📊 Final stats:', {
      totalActiveTime,
      totalInactiveTime,
      sessionsCount: sessions.length,
      workingHoursStats
    });

    return {
      totalActiveTime,
      totalInactiveTime,
      sessionsCount: sessions.length,
      averageSessionTime: sessions.length > 0 ? totalActiveTime / sessions.length : 0,
      workingHoursStats,
    };
  };

  const getSessionsByUser = () => {
    if (!sessions || !inactivityData) return [];

    console.log('👥 Processing sessions by user...');
    const userMap = new Map();

    sessions.forEach(session => {
      const userId = session.user_id;
      const userName = session.profiles?.full_name || session.profiles?.email || 'Utilisateur inconnu';
      
      console.log('👤 Processing session for user:', { userId, userName, email: session.profiles?.email });
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user_id: userId,
          name: userName,
          sessions: [],
          totalActiveTime: 0,
          totalInactiveTime: 0,
          workingHours: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
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

    const result = Array.from(userMap.values());
    console.log('🔄 Sessions by user result:', result);
    return result;
  };

  return {
    sessions,
    inactivityData,
    stats: calculateStats(),
    sessionsByUser: getSessionsByUser(),
    isLoading: sessionsLoading,
  };
};
