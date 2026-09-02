import { useCallback, useEffect, useState } from 'react';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { db, DEVICE_ID } from '../firebase';

const PUSH_ID_ALPHABET = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

function timestampFromPushKey(key) {
  if (!key || key.length !== 20) return null;
  let timestamp = 0;
  for (let index = 0; index < 8; index += 1) {
    const digit = PUSH_ID_ALPHABET.indexOf(key[index]);
    if (digit < 0) return null;
    timestamp = timestamp * 64 + digit;
  }
  return timestamp > 0 ? timestamp : null;
}

export function useLogs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const loadLogs = useCallback(() => {
    setLoading(true);
    setError(null);
    const logsRef = query(ref(db, `smart_fish_pond/${DEVICE_ID}/logs`), limitToLast(50));
    const unsubscribe = onValue(logsRef, (snap) => {
      const out = [];
      snap.forEach((child) => {
        const value = child.val() || {};
        const valueTimestamp = Number(value.timestamp_ms ?? value.timestamp);
        const pushTimestamp = timestampFromPushKey(child.key);
        const parsedTimestamp = Number.isFinite(valueTimestamp) && valueTimestamp > 0 ? valueTimestamp : pushTimestamp;
        const timestamp = parsedTimestamp > 0 && parsedTimestamp < 1e12 ? parsedTimestamp * 1000 : parsedTimestamp;
        out.push({
          ...value,
          timestamp_ms: Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null,
          hardware_uptime_ms: pushTimestamp ? null : valueTimestamp >= 0 && valueTimestamp < 1e12 ? valueTimestamp : null,
        });
      });
      setRows(out);
      setLoaded(true);
      setLoading(false);
    }, (loadError) => {
      setRows([]);
      setLoaded(true);
      setLoading(false);
      setError(loadError);
    });
    return unsubscribe;
  }, []);

  useEffect(() => loadLogs(), [loadLogs]);

  return { rows, loading, loaded, error, loadLogs };
}
