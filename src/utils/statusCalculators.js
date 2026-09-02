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

/**
 * Calculate turbidity status based on ADC value and threshold
 * Clean if below turbidity_dirty_adc, Dirty if above
 */
export function calculateTurbidityStatus(turbidityAdc, thresholds) {
  if (!thresholds || turbidityAdc == null) return null;
  
  const { turbidity_dirty_adc } = thresholds;
  return turbidityAdc < turbidity_dirty_adc ? 'CLEAN' : 'DIRTY';
}
