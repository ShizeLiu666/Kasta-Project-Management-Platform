/**
 * Device Configurations Index
 * Exports all device type configurations
 */

import CCT_DOWNLIGHT_CONFIG from './CCT_DOWNLIGHT';
import CURTAIN_CONFIG from './CURTAIN';
import DIMMER_CONFIG from './DIMMER';
import FIVE_BUTTON_CONFIG from './FIVE_BUTTON';
import FAN_CONFIG from './FAN';
import RGB_CW_CONFIG from './RGB_CW';

// Device configuration mapping
export const DEVICE_CONFIGS = {
  CCT_DOWNLIGHT: CCT_DOWNLIGHT_CONFIG,
  CURTAIN: CURTAIN_CONFIG,
  DIMMER: DIMMER_CONFIG,
  FIVE_BUTTON: FIVE_BUTTON_CONFIG,
  FAN: FAN_CONFIG,
  RGB_CW: RGB_CW_CONFIG,
  // Add more device configurations here
}; 