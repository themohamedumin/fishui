import { useEffect, useRef, useState } from 'react';
import { ref, onValue, update, off } from 'firebase/database';
import { db, DEVICE_ID } from '../firebase';

const OFFLINE_TIMEOUT_MS = 12000;

export function useLiveData() {
  const [live, setLive] = useState(null);
  const [connection, setConnection] = useState('waiting'); // waiting | online | offline | denied
  const watchdog = useRef(null);

  useEffect(() => {
    const liveRef = ref(db, `smart_fish_pond/${DEVICE_ID}/live`);

    const unsub = onValue(
      liveRef,
      (snap) => {
        const val = snap.val();
        if (!val) {
          setConnection('waiting');
          setLive(null);
          return;
        }
        setLive(val);
        setConnection('online');
        if (watchdog.current) clearTimeout(watchdog.current);
        watchdog.current = setTimeout(() => setConnection('offline'), OFFLINE_TIMEOUT_MS);
      },
      () => setConnection('denied')
    );

    return () => {
      unsub();
      off(liveRef);
      if (watchdog.current) clearTimeout(watchdog.current);
    };
  }, []);

  return { live, connection };
}

export function useThresholds() {
  const [thresholds, setThresholds] = useState(null);

  useEffect(() => {
    const thRef = ref(db, `smart_fish_pond/${DEVICE_ID}/control/thresholds`);
    const unsub = onValue(thRef, (snap) => setThresholds(snap.val()));
    return () => {
      unsub();
      off(thRef);
    };
  }, []);

  const saveThresholds = (thresholds) => {
    const controlRef = ref(db, `smart_fish_pond/${DEVICE_ID}/control`);
    return update(controlRef, { thresholds });
  };

  return { thresholds, saveThresholds };
}

export function feedNow() {
  const controlRef = ref(db, `smart_fish_pond/${DEVICE_ID}/control`);
  return update(controlRef, { feed: true });
}
