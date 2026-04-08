import type { ImmersiveConfig } from './config';
import type { ImmersiveEventMap } from './events';
import type { FrameStoreLike, ScrollStoreLike, TimelineRegistryLike } from './plugin';
import type { ImmersiveRenderer } from './renderer';
import type { Subscriber, Unsubscribe } from './utility';

export interface EventBusController {
  emit<TKey extends keyof ImmersiveEventMap>(type: TKey, payload: ImmersiveEventMap[TKey]): void;
  on<TKey extends keyof ImmersiveEventMap>(
    type: TKey,
    handler: Subscriber<ImmersiveEventMap[TKey]>
  ): Unsubscribe;
}

export interface ImmersiveEngineContext {
  config: ImmersiveConfig;
  eventBus: EventBusController;
  scrollStore: ScrollStoreLike;
  frameStore: FrameStoreLike;
  timelineRegistry: TimelineRegistryLike;
  viewport: { width: number; height: number; pixelRatio: number };
  container: HTMLElement | null;
  renderer: ImmersiveRenderer | null;
}
