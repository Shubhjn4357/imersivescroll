import type { ImmersiveFrameManifest } from '../types/manifest';
import type { ValidationIssue, ValidationResult } from '../types/utility';
import { isObject } from '../utils/isObject';

export function validateFrameManifest(
  manifest: unknown
): ValidationResult<ImmersiveFrameManifest> {
  const issues: ValidationIssue[] = [];

  if (!isObject(manifest)) {
    return {
      valid: false,
      issues: [
        {
          code: 'manifest.type',
          message: 'Manifest must be an object',
          path: ''
        }
      ]
    };
  }

  const candidate = manifest as Partial<ImmersiveFrameManifest>;

  if (
    !Number.isInteger(candidate.frameCount) ||
    (candidate.frameCount ?? 0) <= 0
  ) {
    issues.push({
      code: 'manifest.frameCount',
      message: 'frameCount must be a positive integer',
      path: 'frameCount'
    });
  }

  if (
    typeof candidate.framePattern !== 'string' ||
    candidate.framePattern.length === 0
  ) {
    issues.push({
      code: 'manifest.framePattern',
      message: 'framePattern must be a non-empty string',
      path: 'framePattern'
    });
  }

  if (
    typeof candidate.videoHash !== 'string' ||
    candidate.videoHash.length === 0
  ) {
    issues.push({
      code: 'manifest.videoHash',
      message: 'videoHash must be a non-empty string',
      path: 'videoHash'
    });
  }

  return {
    valid: issues.length === 0,
    ...(issues.length === 0
      ? { data: candidate as ImmersiveFrameManifest }
      : {}),
    issues
  };
}
