import { useEffect, useState } from 'react';
import { useThresholds } from '../hooks/usePondData';
import { DEVICE_ID } from '../firebase';
import { StatusRow } from './StatusPieces';

const FIELDS = [
  { key: 'ph_acidic', label: 'pH acidic below', step: '0.1' },
  { key: 'ph_basic', label: 'pH basic above', step: '0.1' },
  { key: 'turbidity_dirty_adc', label: 'Turbidity dirty ADC', step: '1' },
  { key: 'temp_high', label: 'Aerator ON above (°C)', step: '0.1' },
  { key: 'temp_hysteresis', label: 'Aerator OFF hysteresis (°C)', step: '0.1' },
];

export default function SettingsPanel() {
  const { thresholds, saveThresholds } = useThresholds();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (thresholds) setForm(thresholds);
  }, [thresholds]);

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onSave = async () => {
    await saveThresholds({
      ph_acidic: parseFloat(form.ph_acidic),
      ph_basic: parseFloat(form.ph_basic),
      turbidity_dirty_adc: parseInt(form.turbidity_dirty_adc, 10),
      temp_high: parseFloat(form.temp_high),
      temp_hysteresis: parseFloat(form.temp_hysteresis),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="card">
        <div className="section-title">Alert Thresholds</div>
        <div className="form-grid">
          {FIELDS.map(({ key, label, step }) => (
            <div key={key}>
              <label>{label}</label>
              <input
                type="number"
                step={step}
                value={form[key] ?? ''}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={onSave}>
          Save Thresholds
        </button>
        {saved && <span className="save-msg">Saved ✓</span>}
      </div>

      <div className="card">
        <div className="section-title">Device Info</div>
        <StatusRow label="Device ID" value={DEVICE_ID} />
        <StatusRow label="Cloud path" value={`/smart_fish_pond/${DEVICE_ID}`} />
        <StatusRow label="Feeder" value="Servo, 0°–90° gate, 08:00 & 20:00 + on-demand" />
        <StatusRow label="Water level sensing" value="2 float switches (upper / lower)" />
        <StatusRow label="Air pump control" value="Automatic, temperature-based" />
      </div>
    </>
  );
}
