import type { ImmersiveConfig } from './config';
import type { ImmersiveEventMap } from './events';
import type { FrameStoreState } from './frame';
import type { ImmersiveRenderer } from './renderer';
import type { ScrollState } from './scroll';
import type { TimelineEntry } from './timeline';
import type { MaybePromise, Subscriber, Unsubscribe } from './utility';

export interface FrameStoreLike {
  getState(): FrameStoreState;
  subscribe(listener: Subscriber<FrameStoreState>): Unsubscribe;
}

export interface ScrollStoreLike {
  getState(): ScrollState;
  subscribe(listener: Subscriber<ScrollState>): Unsubscribe;
}

export interface TimelineRegistryLike {
  registerTimeline<TValue>(id: string, value: TValue): void;
  removeTimeline(id: string): void;
  getTimeline<TValue = unknown>(id: string): TValue | undefined;
  getAll(): TimelineEntry[];
}

export interface EventBusLike<TEvents extends object> {
  emit<TKey extends keyof TEvents>(type: TKey, payload: TEvents[TKey]): void;
}

export interface ImmersivePluginContext {
  config: ImmersiveConfig;
  eventBus: EventBusLike<ImmersiveEventMap>;
  scrollStore: ScrollStoreLike;
  frameStore: FrameStoreLike;
  timelineRegistry: TimelineRegistryLike;
  viewport: { width: number; height: number; pixelRatio: number };
  container: HTMLElement | null;
  renderer: ImmersiveRenderer | null;
}

export interface ImmersivePlugin {
  name: string;
  setup?(context: ImmersivePluginContext): MaybePromise<void>;
  onReady?(context: ImmersivePluginContext): MaybePromise<void>;
  onScroll?(context: ImmersivePluginContext, state: ScrollState): MaybePromise<void>;
  onFrameChange?(context: ImmersivePluginContext, frameIndex: number): MaybePromise<void>;
  onResize?(context: ImmersivePluginContext): MaybePromise<void>;
  onDestroy?(context: ImmersivePluginContext): MaybePromise<void>;
}
