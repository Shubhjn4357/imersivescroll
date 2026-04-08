import type { CodeSnippet, LandingCard } from './landing-content';

export interface ReferenceProperty {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  defaultValue?: string;
}

export interface ReferenceSection {
  eyebrow: string;
  title: string;
  description: string;
  properties: readonly ReferenceProperty[];
}

export interface HookReference {
  name: string;
  signature: string;
  description: string;
  returns: string;
  usage: string;
  notes: readonly string[];
}

export interface RuntimeStageCard {
  eyebrow: string;
  title: string;
  description: string;
  meta: readonly string[];
}

export const docsQuickstartSnippets: readonly CodeSnippet[] = [
  {
    eyebrow: 'Install',
    title: 'Add the React adapter and motion layer.',
    description:
      'The React adapter owns the sticky viewport and canvas lifecycle. GSAP is optional, but it is the intended companion for premium section choreography.',
    language: 'bash',
    code: `pnpm add @immersive-scroll/react gsap`
  },
  {
    eyebrow: 'First render',
    title: 'Mount the immersive surface with a frame sequence.',
    description:
      'Use a public frame directory plus the generated manifest. The overlay stays separate from the story content so you can evolve them independently.',
    language: 'tsx',
    code: `'use client';\n\nimport {\n  ImmersiveLayer,\n  ImmersiveScroll,\n  useImmersiveFrame,\n  useImmersiveProgress\n} from '@immersive-scroll/react';\n\nfunction SceneStatus() {\n  const frame = useImmersiveFrame();\n  const { progress } = useImmersiveProgress();\n\n  return (\n    <div>\n      <span>Progress {Math.round(progress * 100)}%</span>\n      <span>Frame {frame.currentFrame + 1}</span>\n    </div>\n  );\n}\n\nexport function ProductHero() {\n  return (\n    <ImmersiveScroll\n      framesPath=\"/immersive/launch\"\n      config={{\n        visual: { objectFit: 'cover' },\n        scrollbar: { enabled: true, visibilityMode: 'manual' }\n      }}\n      overlay={\n        <ImmersiveLayer>\n          <SceneStatus />\n        </ImmersiveLayer>\n      }\n    >\n      <section>{/* story panels */}</section>\n    </ImmersiveScroll>\n  );\n}`
  },
  {
    eyebrow: 'Asset prep',
    title: 'Generate frames and a manifest from source video.',
    description:
      'The CLI path keeps frame names and manifest metadata deterministic, which is what the runtime and playground consume.',
    language: 'bash',
    code: `pnpm prepare:example-assets`
  }
] as const;

export const componentReferenceSections: readonly ReferenceSection[] = [
  {
    eyebrow: 'Primary component',
    title: '<ImmersiveScroll />',
    description:
      'The root component that pins the viewport, renders the frame surface, and maps scroll progress into the engine state.',
    properties: [
      {
        name: 'framesPath',
        type: 'string | null',
        description:
          'Public path to the frame directory. Required for the frame-sequence path unless you provide a video source.',
        required: true
      },
      {
        name: 'manifestPath',
        type: 'string | null',
        description:
          'Optional explicit manifest location. When omitted, the runtime resolves `${framesPath}/manifest.json`.',
        defaultValue: 'Derived from framesPath'
      },
      {
        name: 'video',
        type: 'string | null',
        description:
          'Optional source video for direct currentTime-driven implementations or fallback modes.',
        defaultValue: 'null'
      },
      {
        name: 'config',
        type: 'PartialImmersiveConfig',
        description:
          'Partial config override for trigger, visual, scrollbar, mobile, and debug behavior.',
        defaultValue: '{}'
      },
      {
        name: 'plugins',
        type: 'ImmersivePlugin[]',
        description:
          'Lifecycle hooks that can react to ready, scroll, frame change, resize, and destroy events.',
        defaultValue: '[]'
      },
      {
        name: 'overlay',
        type: 'ReactNode',
        description:
          'Absolute overlay layer for status cards, gradients, controls, or floating content that should track the viewport.',
        defaultValue: 'undefined'
      },
      {
        name: 'scrollbarProps',
        type: 'ImmersiveScrollbarProps',
        description:
          'Per-instance scrollbar visibility, placement, interactivity, and style overrides layered on top of the shared scrollbar config.',
        defaultValue: 'undefined'
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'The scroll-driven story content that moves through the pinned viewport.',
        required: true
      },
      {
        name: 'className / style',
        type: 'string / CSSProperties',
        description:
          'Container-level styling hooks for sizing the full scene and aligning it with the surrounding route shell.'
      },
      {
        name: 'loadingFallback / errorFallback',
        type: 'ReactNode',
        description:
          'Optional content rendered while assets are not ready or when loading fails.',
        defaultValue: 'undefined'
      }
    ]
  },
  {
    eyebrow: 'Scrollbar overrides',
    title: 'ImmersiveScrollbarProps',
    description:
      'Optional presentation controls for a single scene instance. Use these when a route wants a different chrome treatment without forking the main config.',
    properties: [
      {
        name: 'visible',
        type: 'boolean',
        description:
          'Forces the custom scrollbar to show or hide regardless of its configured visibility mode.',
        defaultValue: 'undefined'
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Adds a CSS class to the scrollbar root so route-specific design systems can target it.'
      },
      {
        name: 'style',
        type: 'CSSProperties',
        description:
          'Overrides root placement, width, offsets, or z-index for the scrollbar rail.'
      },
      {
        name: 'position / positionMode / offset / top / right / bottom / left',
        type: "placement props",
        description:
          'Lets a single scene instance reposition the scrollbar without mutating shared CSS or editing the component internals.'
      },
      {
        name: 'interactive',
        type: 'boolean',
        description:
          'Enables dragging the thumb or clicking the rail to scroll the scene.',
        defaultValue: 'true'
      },
      {
        name: 'trackStyle',
        type: 'CSSProperties',
        description:
          'Overrides the passive rail appearance while keeping the runtime-driven sizing logic.'
      },
      {
        name: 'thumbStyle',
        type: 'CSSProperties',
        description:
          'Overrides the active thumb appearance, useful for glow, blend, and other route-specific surface treatments.'
      }
    ]
  },
  {
    eyebrow: 'Companion pieces',
    title: 'Overlay and trigger helpers',
    description:
      'These helpers keep overlay concerns small and composable instead of pushing everything into the root component.',
    properties: [
      {
        name: '<ImmersiveLayer />',
        type: 'HTMLAttributes<HTMLDivElement>',
        description:
          'Light wrapper for absolute overlay layers. Use it for gradients, HUDs, control chrome, or static composition elements.'
      },
      {
        name: '<ImmersiveFloating />',
        type: 'PropsWithChildren',
        description:
          'Applies a subtle velocity-driven vertical transform to the wrapped content for depth.'
      },
      {
        name: '<ImmersiveTriggerZone start end />',
        type: '{ start: number; end: number; onEnter?; onLeave? }',
        description:
          'Activates content or callbacks inside a normalized 0..1 progress segment without reaching for GSAP.'
      }
    ]
  }
] as const;

export const hookReferenceItems: readonly HookReference[] = [
  {
    name: 'useImmersiveFrame',
    signature: 'const frame = useImmersiveFrame()',
    description:
      'Reads the current frame state from the active immersive provider.',
    returns:
      '{ currentFrame, totalFrames, frameUrl, manifest, isReady, error }',
    usage: `const frame = useImmersiveFrame();\nconst label = \`Frame \${frame.currentFrame + 1}/\${frame.totalFrames}\`;`,
    notes: [
      'Best for HUDs, frame badges, and progressive loading states.',
      'Use `frame.isReady` before depending on frame metadata in overlays.'
    ]
  },
  {
    name: 'useImmersiveProgress',
    signature: 'const state = useImmersiveProgress(start?, end?)',
    description:
      'Exposes global progress plus a segment-normalized progress window for a subsection of the story.',
    returns: '{ progress, segmentProgress }',
    usage: `const { progress, segmentProgress } = useImmersiveProgress(0.2, 0.45);`,
    notes: [
      'Use `segmentProgress` for local copy fades, counters, and section indicators.',
      'The `start` and `end` values are normalized scene progress, not pixels.'
    ]
  },
  {
    name: 'useImmersiveScroll',
    signature: 'const scroll = useImmersiveScroll()',
    description:
      'Provides scroll metadata plus a thin imperative API for pausing or resuming engine updates.',
    returns:
      '{ progress, direction, velocity, scrollY, isScrolling, scrollTo, pauseScroll, resumeScroll }',
    usage: `const scroll = useImmersiveScroll();\nif (scroll.direction === 'forward') {\n  // update auxiliary UI\n}`,
    notes: [
      'The built-in `scrollTo` delegates to `window.scrollTo` and then syncs the engine.',
      'Use it for route-level helpers, not for replacing native scroll behavior.'
    ]
  },
  {
    name: 'useImmersiveScrollbar',
    signature: 'const scrollbar = useImmersiveScrollbar()',
    description:
      'Reads the resolved scrollbar config and live scrollbar progress for custom chrome.',
    returns:
      '{ enabled, progress, isScrolling, autoHide, visibilityMode, position, positionMode, top, right, bottom, left, scrollToProgress, ... }',
    usage: `const scrollbar = useImmersiveScrollbar();\n\nscrollbar.scrollToProgress(0.5);\nconst progressLabel = Math.round(scrollbar.progress * 100);`,
    notes: [
      'Useful when you want a design-system-native scrollbar shell outside the packaged component.',
      'Returns already-resolved values from the merged config.',
      'Includes `scrollToProgress()` so custom scrollbar UIs can drive the scene.'
    ]
  },
  {
    name: 'useImmersiveTrigger',
    signature: 'const trigger = useImmersiveTrigger(start, end)',
    description:
      'Maps a progress segment into active, entered, and left states for declarative section behavior.',
    returns:
      '{ active, entered, left, progress, direction }',
    usage: `const trigger = useImmersiveTrigger(0.3, 0.5);\nconst activeClassName = trigger.active ? 'is-active' : '';`,
    notes: [
      'Use this when GSAP would be excessive for a simple state toggle.',
      'Pair it with CSS transitions or counter logic inside a scene.'
    ]
  },
  {
    name: 'useImmersiveVelocity',
    signature: 'const velocity = useImmersiveVelocity()',
    description:
      'Returns the current normalized scroll velocity from the active immersive scene.',
    returns: 'number',
    usage: `const velocity = useImmersiveVelocity();\nconst offset = Math.min(velocity * 8, 24);`,
    notes: [
      'Useful for subtle parallax, floating cards, or reactive chrome.',
      'Keep the result bounded so sharp wheel deltas do not overshoot.'
    ]
  },
  {
    name: 'useScrollTriggerSetup',
    signature:
      'useScrollTriggerSetup({ scopeRef, dependencies, disabled, setup })',
    description:
      'Registers GSAP and ScrollTrigger once, scopes all generated triggers to the current component, and handles cleanup on route changes or strict-mode rerenders.',
    returns: 'void',
    usage: `const scopeRef = useRef<HTMLElement>(null);\n\nuseScrollTriggerSetup({\n  scopeRef,\n  setup: ({ gsap, ScrollTrigger, scope }) => {\n    const items = gsap.utils.selector(scope)('[data-reveal]');\n    gsap.fromTo(items, { opacity: 0 }, { opacity: 1, stagger: 0.08 });\n    ScrollTrigger.refresh();\n  }\n});`,
    notes: [
      'Prefer this over hand-written `useEffect` cleanup for page-level GSAP work in React.',
      'The `setup` callback only runs on the client after the scope is mounted.'
    ]
  }
] as const;

export const configReferenceSections: readonly ReferenceSection[] = [
  {
    eyebrow: 'Config group',
    title: 'scroll',
    description:
      'Controls how scroll input is interpreted before progress reaches the frame engine.',
    properties: [
      {
        name: 'enabled',
        type: 'boolean',
        description: 'Enables or disables scroll updates for the scene.',
        defaultValue: 'true'
      },
      {
        name: 'smooth',
        type: 'boolean',
        description:
          'Signals that the scene should use smoothed scroll behavior when a renderer supports it.',
        defaultValue: 'true'
      },
      {
        name: 'lerp / duration',
        type: 'number',
        description:
          'Fine-tunes interpolation intensity and smoothing duration when the scroll system is extended.',
        defaultValue: '0.1 / 1.2'
      },
      {
        name: 'wheelMultiplier / touchMultiplier',
        type: 'number',
        description:
          'Adjusts raw input sensitivity for wheel and touch devices.',
        defaultValue: '1 / 1.5'
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        description: 'Declares the intended scroll axis.',
        defaultValue: "'vertical'"
      },
      {
        name: 'spring',
        type: 'ScrollSpringConfig',
        description:
          'Optional spring envelope with stiffness, damping, mass, and threshold values.',
        defaultValue: '{ enabled: true, stiffness: 120, damping: 24, mass: 1 }'
      }
    ]
  },
  {
    eyebrow: 'Config group',
    title: 'trigger',
    description:
      'Defines how the viewport is pinned and how progress should map to the scene range.',
    properties: [
      {
        name: 'start / end',
        type: 'string',
        description:
          'ScrollTrigger-compatible bounds that describe the start and end of the scene range.',
        defaultValue: "'top top' / 'bottom bottom'"
      },
      {
        name: 'scrub',
        type: 'boolean | number',
        description:
          'Keeps progress tied to scroll position. Numeric values apply smoothing to the scrub linkage.',
        defaultValue: 'true'
      },
      {
        name: 'pin',
        type: 'boolean',
        description: 'Pins the viewport while the content continues to scroll.',
        defaultValue: 'true'
      },
      {
        name: 'anticipatePin / markers',
        type: 'number / boolean',
        description:
          'Advanced ScrollTrigger tuning for pin stabilization and debugging.',
        defaultValue: '1 / false'
      }
    ]
  },
  {
    eyebrow: 'Config group',
    title: 'visual',
    description:
      'Applies renderer-facing presentation rules such as fit mode, image filters, and base background.',
    properties: [
      {
        name: 'backgroundColor',
        type: 'string',
        description: 'Base fill color used behind the render surface.',
        defaultValue: "'#000000'"
      },
      {
        name: 'overlayOpacity',
        type: 'number',
        description:
          'Default vignette or overlay intensity for cinematic scenes.',
        defaultValue: '0'
      },
      {
        name: 'brightness / contrast / saturate / blur',
        type: 'number',
        description:
          'Canvas/image filter controls for quick art direction without re-exporting assets.',
        defaultValue: '1 / 1 / 1 / 0'
      },
      {
        name: 'objectFit / objectPosition',
        type: "ObjectFitMode / string",
        description:
          'Controls how frames fill the viewport and how the crop anchor should behave.',
        defaultValue: "'cover' / 'center center'"
      }
    ]
  },
  {
    eyebrow: 'Config group',
    title: 'scrollbar',
    description:
      'Configures the packaged custom scrollbar and its visibility model.',
    properties: [
      {
        name: 'enabled',
        type: 'boolean',
        description: 'Turns the packaged scrollbar on or off.',
        defaultValue: 'false'
      },
      {
        name: 'position / width / radius / offset',
        type: 'string / number',
        description:
          'Controls rail placement and base geometry.',
        defaultValue: "'right' / 6 / 999 / 16"
      },
      {
        name: 'positionMode / top / right / bottom / left',
        type: "placement values",
        description:
          'Controls whether the rail is placed absolutely within the immersive viewport or fixed to the window, and lets each edge be tuned independently.'
      },
      {
        name: 'trackOpacity / thumbOpacity',
        type: 'number',
        description:
          'Controls the resting visibility of both rails.',
        defaultValue: '0.2 / 0.75'
      },
      {
        name: 'autoHide / visibilityMode',
        type: 'boolean / visibility union',
        description:
          "Select between 'always', 'scroll', 'hover', or 'manual' visibility behavior.",
        defaultValue: 'true / always'
      },
      {
        name: 'minThumbSize / trackColor / thumbColor',
        type: 'number / string / string',
        description:
          'Ensures the thumb remains visible while preserving design control.',
        defaultValue: "72 / '#ffffff' / '#ffffff'"
      },
      {
        name: 'interactive',
        type: 'boolean',
        description:
          'When true, the packaged scrollbar can be clicked or dragged to drive the scene scroll.',
        defaultValue: 'true'
      }
    ]
  },
  {
    eyebrow: 'Config group',
    title: 'mobile',
    description:
      'Helps scenes degrade gracefully on small screens and lower-powered devices.',
    properties: [
      {
        name: 'enabled',
        type: 'boolean',
        description: 'Turns the mobile branch on or off.',
        defaultValue: 'true'
      },
      {
        name: 'reduceFrames / maxFrames',
        type: 'boolean / number',
        description:
          'Lets you shorten a sequence and cap frame volume on constrained devices.',
        defaultValue: 'true / 120'
      },
      {
        name: 'disableFloatingEffects / disablePinOnSmallScreens',
        type: 'boolean / boolean',
        description:
          'Allows smaller viewports to opt out of ornamental depth or the full pinned experience.',
        defaultValue: 'false / false'
      }
    ]
  },
  {
    eyebrow: 'Config group',
    title: 'debug',
    description:
      'Exposes internal scene metrics while you tune assets or scroll math.',
    properties: [
      {
        name: 'enabled',
        type: 'boolean',
        description: 'Shows the packaged debug panel when true.',
        defaultValue: 'false'
      },
      {
        name: 'showFrameIndex / showProgress / showVelocity / showManifestStatus',
        type: 'boolean',
        description:
          'Toggles individual fields in the packaged debug HUD.',
        defaultValue: 'false'
      }
    ]
  }
] as const;

export const docsOperationalCards: readonly LandingCard[] = [
  {
    title: 'SSR safety',
    description:
      'Keep scene setup inside client components and use scoped GSAP setup helpers for browser-only motion work.'
  },
  {
    title: 'Sequence quality',
    description:
      'Use fewer, cleaner frames before adding more effects. Large frame sets often hurt more than they help.'
  },
  {
    title: 'Fallback strategy',
    description:
      'Expose a static poster or shortened scene for reduced-motion users and small mobile screens.'
  },
  {
    title: 'Source discipline',
    description:
      'Use one design source for landing copy, docs copy, and adapter demos so product changes stay aligned.'
  }
] as const;

export const runtimeStageCards: readonly RuntimeStageCard[] = [
  {
    eyebrow: 'Primary shell',
    title: 'Next.js site surface',
    description:
      'Owns the polished home, docs, demo, and playground routes with the strongest information architecture.',
    meta: ['App Router', 'Primary editing surface']
  },
  {
    eyebrow: 'Adapter parity',
    title: 'React and Solid demos',
    description:
      'Stay close enough to the site shell to catch API regressions without re-authoring the entire product site.',
    meta: ['Shared content', 'Parity checks']
  },
  {
    eyebrow: 'DOM-first path',
    title: 'Vanilla embed surface',
    description:
      'Useful when a CMS or custom element boundary owns the surrounding page and you only need the immersive block.',
    meta: ['Light ownership', 'Manifest driven']
  }
] as const;

export const exampleWorkflowCards: readonly LandingCard[] = [
  {
    title: 'One story source',
    description:
      'Copy, destination cards, metrics, and design tokens are shared instead of being rewritten for every adapter.'
  },
  {
    title: 'One asset pipeline',
    description:
      'All demos consume the same manifest and optimized frame directory so playback behavior stays comparable.'
  },
  {
    title: 'One motion vocabulary',
    description:
      'Surface cards, floating accents, section reveals, and pinned scenes use the same choreography language across routes.'
  }
] as const;
