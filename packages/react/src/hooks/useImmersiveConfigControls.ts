import {
  deepMerge,
  type ImmersiveConfig,
  type PartialImmersiveConfig
} from '@immersive-scroll/shared';
import { useState } from 'react';

type ConfigControlSectionKey =
  | 'scroll'
  | 'trigger'
  | 'visual'
  | 'scrollbar'
  | 'mobile'
  | 'events'
  | 'debug';

type ConfigControlSectionValue<TKey extends ConfigControlSectionKey> =
  NonNullable<PartialImmersiveConfig[TKey]>;

type SectionConfigMap = Pick<ImmersiveConfig, ConfigControlSectionKey>;

export interface UseImmersiveConfigControlsOptions {
  initialConfig?: PartialImmersiveConfig;
}

export interface ImmersiveConfigControls {
  config: PartialImmersiveConfig;
  replaceConfig: (nextConfig: PartialImmersiveConfig) => void;
  mergeConfig: (nextConfig: PartialImmersiveConfig) => void;
  updateSection: <TKey extends ConfigControlSectionKey>(
    section: TKey,
    nextValue: ConfigControlSectionValue<TKey>
  ) => void;
  updateScroll: (nextValue: ConfigControlSectionValue<'scroll'>) => void;
  updateTrigger: (nextValue: ConfigControlSectionValue<'trigger'>) => void;
  updateVisual: (nextValue: ConfigControlSectionValue<'visual'>) => void;
  updateScrollbar: (nextValue: ConfigControlSectionValue<'scrollbar'>) => void;
  updateMobile: (nextValue: ConfigControlSectionValue<'mobile'>) => void;
  updateEvents: (nextValue: ConfigControlSectionValue<'events'>) => void;
  updateDebug: (nextValue: ConfigControlSectionValue<'debug'>) => void;
  resetConfig: () => void;
}

function cloneConfig(config: PartialImmersiveConfig) {
  return deepMerge({} as PartialImmersiveConfig, config);
}

function mergeConfigState(
  currentConfig: PartialImmersiveConfig,
  nextConfig: PartialImmersiveConfig
) {
  return deepMerge(currentConfig, nextConfig);
}

function createSectionPatch<TKey extends ConfigControlSectionKey>(
  section: TKey,
  nextValue: ConfigControlSectionValue<TKey>
) {
  return {
    [section]: nextValue
  } as Pick<SectionConfigMap, TKey> as PartialImmersiveConfig;
}

export function useImmersiveConfigControls(
  options: UseImmersiveConfigControlsOptions = {}
): ImmersiveConfigControls {
  const { initialConfig = {} } = options;
  const [config, setConfig] = useState<PartialImmersiveConfig>(() =>
    cloneConfig(initialConfig)
  );

  const replaceConfig = (nextConfig: PartialImmersiveConfig) => {
    setConfig(cloneConfig(nextConfig));
  };

  const mergeConfig = (nextConfig: PartialImmersiveConfig) => {
    setConfig((currentConfig) => mergeConfigState(currentConfig, nextConfig));
  };

  const updateSection = <TKey extends ConfigControlSectionKey>(
    section: TKey,
    nextValue: ConfigControlSectionValue<TKey>
  ) => {
    setConfig((currentConfig) =>
      mergeConfigState(currentConfig, createSectionPatch(section, nextValue))
    );
  };

  return {
    config,
    replaceConfig,
    mergeConfig,
    updateSection,
    updateScroll(nextValue) {
      updateSection('scroll', nextValue);
    },
    updateTrigger(nextValue) {
      updateSection('trigger', nextValue);
    },
    updateVisual(nextValue) {
      updateSection('visual', nextValue);
    },
    updateScrollbar(nextValue) {
      updateSection('scrollbar', nextValue);
    },
    updateMobile(nextValue) {
      updateSection('mobile', nextValue);
    },
    updateEvents(nextValue) {
      updateSection('events', nextValue);
    },
    updateDebug(nextValue) {
      updateSection('debug', nextValue);
    },
    resetConfig() {
      setConfig(cloneConfig(initialConfig));
    }
  };
}
