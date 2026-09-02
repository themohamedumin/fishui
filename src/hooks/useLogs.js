import { useCallback, useState } from 'react';
import { ref, query, limitToLast, get } from 'firebase/database';
import { db, DEVICE_ID } from '../firebase';

export function useLogs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const logsRef = query(ref(db, `smart_fish_pond/${DEVICE_ID}/logs`), limitToLast(50));
      const snap = await get(logsRef);
      const out = [];
      snap.forEach((child) => {
        const value = child.val() || {};
        const rawTimestamp = value.timestamp_ms ?? value.timestamp ?? child.key;
        const timestamp = Number(rawTimestamp);

        out.push({
          ...value,
          timestamp_ms: Number.isFinite(timestamp) && timestamp > 0 ? timestamp : Date.now(),
        });
      });
      setRows(out);
      setLoaded(true);
    } catch (error) {
      setRows([]);
      setLoaded(true);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { rows, loading, loaded, error, loadLogs };
}
