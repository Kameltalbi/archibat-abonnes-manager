
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache les données pendant 5 minutes par défaut
      staleTime: 5 * 60 * 1000,
      // Garde les données en mémoire pendant 10 minutes
      gcTime: 10 * 60 * 1000,
      // Réessaie seulement une fois en cas d'erreur
      retry: 1,
      // Ne refetch pas automatiquement au focus de la fenêtre
      refetchOnWindowFocus: false,
      // Ne refetch pas automatiquement à la reconnexion
      refetchOnReconnect: false,
    },
    mutations: {
      // Réessaie les mutations échouées une fois
      retry: 1,
    },
  },
});
