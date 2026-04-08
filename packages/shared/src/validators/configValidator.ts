import { DEFAULT_IMMERSIVE_CONFIG } from '../constants/defaultConfig';
import type { ImmersiveConfig, PartialImmersiveConfig } from '../types/config';
import type { ValidationIssue, ValidationResult } from '../types/utility';
import { deepMerge } from '../utils/deepMerge';

export function validateConfig(input: PartialImmersiveConfig | undefined): ValidationResult<ImmersiveConfig> {
  const config = deepMerge(DEFAULT_IMMERSIVE_CONFIG, input);
  const issues: ValidationIssue[] = [];

  if (config.preloadCount < 0) {
    issues.push({ code: 'config.preloadCount', message: 'preloadCount must be >= 0', path: 'preloadCount' });
  }

  if (config.unloadDistance < 0) {
    issues.push({
      code: 'config.unloadDistance',
      message: 'unloadDistance must be >= 0',
      path: 'unloadDistance'
    });
  }

  if (config.quality <= 0 || config.quality > 100) {
    issues.push({ code: 'config.quality', message: 'quality must be between 1 and 100', path: 'quality' });
  }

  return {
    valid: issues.length === 0,
    data: config,
    issues
  };
}
