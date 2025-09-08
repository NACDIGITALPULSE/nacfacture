import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export const useRealtimeSubscriptions = (onNewPendingSubscription?: () => void) => {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('subscriptions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_subscriptions',
          filter: 'subscription_status=eq.pending'
        },
        () => {
          onNewPendingSubscription?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_subscriptions'
        },
        () => {
          onNewPendingSubscription?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, onNewPendingSubscription]);
};