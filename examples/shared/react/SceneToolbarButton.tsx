import type { LucideIcon } from 'lucide-react';

export interface SceneToolbarButtonProps {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function SceneToolbarButton({
  active,
  icon: Icon,
  label,
  onClick
}: SceneToolbarButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={`demo-toolbar__button${
        active ? ' demo-toolbar__button--active' : ''
      }`}
      type="button"
      onClick={onClick}
    >
      <Icon
        aria-hidden="true"
        className="icon-button__icon"
        strokeWidth={1.85}
      />
      <span>{label}</span>
    </button>
  );
}
