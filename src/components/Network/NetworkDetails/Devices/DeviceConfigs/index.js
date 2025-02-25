/**
 * Device Configurations Index
 * Exports all device type configurations
 */

import CCT_DOWNLIGHT_CONFIG from './CCT_DOWNLIGHT';
import CURTAIN_CONFIG from './CURTAIN';
import FIVE_BUTTON_CONFIG from './FIVE_BUTTON';

// Device configuration mapping
export const DEVICE_CONFIGS = {
  CCT_DOWNLIGHT: CCT_DOWNLIGHT_CONFIG,
  CURTAIN: CURTAIN_CONFIG,
  FIVE_BUTTON: FIVE_BUTTON_CONFIG,
  // Add more device configurations here
}; 