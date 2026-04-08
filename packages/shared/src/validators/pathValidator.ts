import type { ValidationResult } from '../types/utility';

export function validateAssetPath(input: string | null | undefined): ValidationResult<string> {
  if (!input || input.trim().length === 0) {
    return {
      valid: false,
      issues: [{ code: 'path.empty', message: 'Path must be a non-empty string', path: '' }]
    };
  }

  return {
    valid: true,
    data: input,
    issues: []
  };
}
