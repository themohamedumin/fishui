/**
 * Calculate pH status based on pH value and configured thresholds
 * Safe range: between ph_acidic (lower bound) and ph_basic (upper bound)
 */
export function calculatePhStatus(phValue, thresholds) {
  if (!thresholds || phValue == null) return null;

  const { ph_acidic, ph_basic } = thresholds;

  // pH is OK if it's between the acidic and basic bounds
  if (phValue >= ph_acidic && phValue <= ph_basic) {
    return 'OK';
  }
  return 'NOT_OK';
}

export const TURBIDITY_CLEAN_MAX = 2048;
export const TURBIDITY_CAUTION_MAX = 3072;

/**
 * Convert raw ADC turbidity to impurity % using the sensor's actual direction:
 * higher ADC => dirtier water, with 4095 as the full-scale maximum.
 */
export function calculateTurbidityImpurityPercent(turbidityAdc) {
  if (turbidityAdc == null) return 0;

  const adc = Math.min(Math.max(Number(turbidityAdc), 0), 4095);
  return Math.round((adc / 4095) * 100);
}

/**
 * Match the ESP32 firmware threshold logic:
 * ADC <= 2048 => CLEAN
 * 2048 < ADC <= 3072 => CAUTION
 * ADC > 3072 => DANGER
 */
export function calculateTurbidityStatus(turbidityAdc) {
  if (turbidityAdc == null) return null;

  const adc = Number(turbidityAdc);

  if (adc <= TURBIDITY_CLEAN_MAX) return 'CLEAN';
  if (adc <= TURBIDITY_CAUTION_MAX) return 'CAUTION';
  return 'DANGER';
}
