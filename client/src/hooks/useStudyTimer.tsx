import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

const FLUSH_INTERVAL_MS = 60_000; // flush every 60 seconds
const MIN_MINUTES = 1;            // only record if at least 1 minute

/**
 * Tracks how long the user is actively on the platform.
 * Flushes accumulated minutes to the server every 60 seconds.
 * Pauses when the tab is hidden (user switched away).
 */
export function useStudyTimer() {
  const { user } = useAuth();
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0); // ms accumulated while visible

  const flush = async (userId: number, ms: number) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < MIN_MINUTES) return;
    try {
      await fetch(`/api/users/${userId}/study-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ minutes }),
      });
    } catch {
      // silent — non-critical
    }
  };

  useEffect(() => {
    if (!user || user.id <= 0) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden — stop timer, accumulate
        if (startRef.current !== null) {
          accumulatedRef.current += Date.now() - startRef.current;
          startRef.current = null;
        }
      } else {
        // Tab visible — resume timer
        startRef.current = Date.now();
      }
    };

    // Start timer
    startRef.current = Date.now();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Flush every minute
    const interval = setInterval(() => {
      if (startRef.current !== null) {
        accumulatedRef.current += Date.now() - startRef.current;
        startRef.current = Date.now();
      }
      if (accumulatedRef.current > 0) {
        flush(user.id, accumulatedRef.current);
        accumulatedRef.current = 0;
      }
    }, FLUSH_INTERVAL_MS);

    // Flush on unmount / page close
    const handleUnload = () => {
      if (startRef.current !== null) {
        accumulatedRef.current += Date.now() - startRef.current;
      }
      if (accumulatedRef.current > 0) {
        // Use sendBeacon for reliability on page close
        const blob = new Blob(
          [JSON.stringify({ minutes: Math.floor(accumulatedRef.current / 60000) })],
          { type: 'application/json' }
        );
        navigator.sendBeacon(`/api/users/${user.id}/study-time`, blob);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      // Final flush on component unmount
      if (startRef.current !== null) {
        accumulatedRef.current += Date.now() - startRef.current;
      }
      if (accumulatedRef.current > 0) {
        flush(user.id, accumulatedRef.current);
      }
    };
  }, [user?.id]);
}
