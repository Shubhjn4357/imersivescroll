export interface TriggerActivationState {
  active: boolean;
  entered: boolean;
  left: boolean;
}

export function getTriggerActivation(
  progress: number,
  previousProgress: number,
  start: number,
  end: number
): TriggerActivationState {
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);
  const active = progress >= rangeStart && progress <= rangeEnd;
  const previousActive =
    previousProgress >= rangeStart && previousProgress <= rangeEnd;

  return {
    active,
    entered: active && !previousActive,
    left: !active && previousActive
  };
}
