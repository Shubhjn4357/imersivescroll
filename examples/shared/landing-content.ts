export interface SiteLink {
  label: string;
  href: string;
  accent?: boolean;
}

export interface LandingMetric {
  label: string;
  value: string;
}

export interface LandingSection {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  align: 'left' | 'right';
  detailChips: string[];
}

export interface LandingCard {
  title: string;
  description: string;
}

export interface DestinationCard {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface ContentListItem {
  title: string;
  description: string;
  href?: string;
  meta?: string[];
}

export interface ContentCollection {
  eyebrow: string;
  title: string;
  description: string;
  items: ContentListItem[];
}

export interface CodeSnippet {
  eyebrow: string;
  title: string;
  description: string;
  language: 'ts' | 'tsx' | 'bash';
  code: string;
}

export const defaultSceneFramesPath = '/immersive/scene';
export const defaultSceneManifestPath = `${defaultSceneFramesPath}/manifest.json`;

export const defaultLandingNavigationLinks: SiteLink[] = [
  { label: 'Overview', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Frameworks', href: '#frameworks' },
  { label: 'Docs', href: '#docs', accent: true }
];

export const nextDemoNavigationLinks: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Demo', href: '/demo' },
  { label: 'Playground', href: '/playground', accent: true }
];

export const defaultLandingActions: SiteLink[] = [
  { label: 'View features', href: '#features', accent: true },
  { label: 'Read docs', href: '#docs' }
];

export const nextLandingActions: SiteLink[] = [
  { label: 'Read docs', href: '/docs', accent: true },
  { label: 'Open demo', href: '/demo' }
];

export const defaultLandingDestinationCards: DestinationCard[] = [
  {
    eyebrow: 'Feature set',
    title: 'Design-led scrollbar',
    description:
      'Manual visibility, color control, and sizing keep the chrome part of the composition.',
    href: '#features'
  },
  {
    eyebrow: 'Adapters',
    title: 'Framework parity',
    description:
      'Next, React, Solid, and Web stay aligned through one shared visual source.',
    href: '#frameworks'
  },
  {
    eyebrow: 'Guides',
    title: 'Production docs',
    description:
      'Installation, frame extraction, and troubleshooting live alongside the demo.',
    href: '#docs'
  }
];

export const nextLandingDestinationCards: DestinationCard[] = [
  {
    eyebrow: 'Docs',
    title: 'Ship the core setup',
    description:
      'Read the install path, adapter overview, and frame pipeline before wiring a product page.',
    href: '/docs'
  },
  {
    eyebrow: 'Demo',
    title: 'Inspect the live component surface',
    description:
      'Walk through the immersive component with a live preview, section docs, and API guidance.',
    href: '/demo'
  },
  {
    eyebrow: 'Playground',
    title: 'Tune the scene interactively',
    description:
      'Use the contained workbench to tweak props, inspect scroll behavior, and review the live config shape.',
    href: '/playground'
  }
];

export const landingHero = {
  eyebrow: 'Immersive Scroll Video',
  title: 'Build polished scroll cinema without sacrificing native scroll.',
  description:
    'A mobile-first component system for frame sequences, fixed full-screen scenes, configurable scene chrome, shipped CLI tooling, and cross-framework adapters.'
};

export const landingMetrics: LandingMetric[] = [
  { label: 'Core pattern', value: 'Fixed viewport + scrub' },
  { label: 'Source pipeline', value: '24/30 fps -> WebP' },
  { label: 'Controls', value: 'Typed hooks + props' }
];

export const landingSections: LandingSection[] = [
  {
    id: 'opening',
    index: '01',
    eyebrow: 'Visual system',
    title: 'Keep the viewport pinned and let the narrative move around it.',
    description:
      'The frame sequence stays anchored while copy glides through the scene, so the page feels directed instead of mechanically animated.',
    align: 'left',
    detailChips: [
      'Pinned viewport',
      'Glass overlay cards',
      'Scroll-linked pacing'
    ]
  },
  {
    id: 'scrub-engine',
    index: '02',
    eyebrow: 'Scrub engine',
    title:
      'Use frame-accurate progress mapping instead of fragile scroll hacks.',
    description:
      'The render surface tracks component-relative progress, not the whole document, which keeps multi-section stories stable and removes drift.',
    align: 'right',
    detailChips: [
      'Container progress',
      'Latest-frame wins',
      'Resize-safe canvas'
    ]
  },
  {
    id: 'gsap-layer',
    index: '03',
    eyebrow: 'Motion layer',
    title:
      'Layer GSAP and ScrollTrigger on top for premium content choreography.',
    description:
      'ScrollTrigger drives the reveal timing, floating offsets, and section transitions while native scroll stays intact underneath.',
    align: 'left',
    detailChips: ['GSAP', 'ScrollTrigger', 'No scroll hijacking']
  },
  {
    id: 'delivery',
    index: '04',
    eyebrow: 'Delivery',
    title: 'Start from one shared design surface and ship it across runtimes.',
    description:
      'The landing copy, tokens, and card architecture now live in one place so product changes do not fork into four separate demos.',
    align: 'right',
    detailChips: ['Shared tokens', 'Typed content model', 'Future expansion']
  }
];

export const landingFeatureCards: LandingCard[] = [
  {
    title: 'Frame-sequence rendering',
    description:
      'Canvas rendering with cached images keeps scrubbing reliable even when video seeking would stutter.'
  },
  {
    title: 'Optional GSAP choreography',
    description:
      'ScrollTrigger powers section reveals, floating cards, and polished motion without replacing native scroll.'
  },
  {
    title: 'Custom scrollbar system',
    description:
      'Width, offset, visibility mode, thumb sizing, opacity, and color all stay configurable from the shared config.'
  },
  {
    title: 'Design-system ready',
    description:
      'Glass cards, tokens, and content collections are structured for future route expansion instead of single-page throwaway demos.'
  }
];

export const landingFrameworkCards: LandingCard[] = [
  {
    title: 'Next.js',
    description:
      'Primary development surface with route-level home, docs, demo, and playground pages.'
  },
  {
    title: 'React',
    description:
      'Direct adapter surface using the same shared story and animation vocabulary.'
  },
  {
    title: 'Solid',
    description:
      'Signal-based wrapper that keeps the same frame manifest and visual tokens in play.'
  },
  {
    title: 'Vanilla Web',
    description:
      'DOM-first runtime for custom elements or CMS-managed shells that still need the same scene structure.'
  }
];

export const landingDocsCards: LandingCard[] = [
  {
    title: 'Installation',
    description:
      'Workspace setup, adapter imports, and the fastest path to a first render.'
  },
  {
    title: 'Frame pipeline',
    description:
      'Trim, extract, optimize, and validate source clips before publishing a scroll sequence.'
  },
  {
    title: 'Scroll choreography',
    description:
      'Blend native progress, ScrollTrigger, and custom overlays without visual drift.'
  },
  {
    title: 'Troubleshooting',
    description:
      'Recover from SSR issues, frame mismatch, broken assets, and ffmpeg-related failures.'
  }
];

export const landingSource = {
  title: 'Scene asset',
  label: 'Generated frame sequence',
  license: 'See /public/immersive/scene/SOURCE.md'
};

export const docsCollections: ContentCollection[] = [
  {
    eyebrow: 'Getting started',
    title: 'Start fast, then harden the pipeline.',
    description:
      'Cover the install path, adapter setup, and asset preparation before tuning motion.',
    items: [
      {
        title: 'Installation flow',
        description:
          'Workspace scripts, package boundaries, and where the shared landing source sits.'
      },
      {
        title: 'Quick starts',
        description:
          'Framework-specific entry points for React, Next.js, Solid, and Vanilla Web.'
      },
      {
        title: 'Frame extraction',
        description:
          'Generate manifests, optimized frames, and public assets from a real source clip.'
      }
    ]
  },
  {
    eyebrow: 'Architecture',
    title: 'Understand the render path before scaling it.',
    description:
      'The core engine, adapter layer, and visual system are separated so the scene can evolve without ripping through every runtime.',
    items: [
      {
        title: 'Core engine',
        description:
          'Frame store, progress controller, resize sync, and renderer lifecycle.'
      },
      {
        title: 'Adapters',
        description:
          'How React, Next, Solid, and Web bridge one engine into different UI surfaces.'
      },
      {
        title: 'Plugin system',
        description:
          'Hook in section triggers, depth overlays, or future design layers without patching the engine.'
      }
    ]
  },
  {
    eyebrow: 'Reliability',
    title: 'Keep the story stable in production.',
    description:
      'Use the guides when you need to preserve smooth scrubbing across slower hardware and SSR environments.',
    items: [
      {
        title: 'Performance tuning',
        description:
          'Balance frame count, preload distance, image format, and mobile reduction strategy.'
      },
      {
        title: 'Reduced motion',
        description:
          'Design graceful fallbacks for low-power devices and user preference constraints.'
      },
      {
        title: 'Troubleshooting',
        description:
          'Fix broken canvases, mismatched manifests, and server/client rendering issues.'
      }
    ]
  }
];

export const exampleShowcaseCards: ContentCollection[] = [
  {
    eyebrow: 'Framework adapters',
    title: 'One visual language, multiple runtimes.',
    description:
      'The site keeps the polished Next.js surface, but the same story structure is still consumable elsewhere.',
    items: [
      {
        title: 'Next.js landing surface',
        description:
          'App Router pages for home, docs, demo, and playground using the shared site shell.',
        meta: ['Primary dev target', 'Route-based IA']
      },
      {
        title: 'React demo',
        description:
          'Thin wrapper around the shared landing source for direct adapter testing.',
        meta: ['Single-page demo', 'Shared component']
      },
      {
        title: 'Solid demo',
        description:
          'Signal-based example mirroring the same cards, sections, and frame assets.',
        meta: ['Solid adapter', 'Shared data']
      },
      {
        title: 'Web runtime',
        description:
          'DOM-first assembly path for cases where framework ownership is intentionally light.',
        meta: ['Custom element ready', 'Manifest-driven']
      }
    ]
  },
  {
    eyebrow: 'Usage patterns',
    title: 'Choose the scene shape that fits the product.',
    description:
      'Not every experience needs a huge reveal page. The same primitives support tighter layouts too.',
    items: [
      {
        title: 'Product launch story',
        description:
          'Full-height narrative with route-level sections and premium overlays.'
      },
      {
        title: 'Docs hero',
        description:
          'Use the immersive scene as a visual anchor before switching to denser content.'
      },
      {
        title: 'Playground rail',
        description:
          'Compact sticky scene for implementation demos, education, and QA validation.'
      }
    ]
  }
];

export const playgroundStackCards: LandingCard[] = [
  {
    title: 'GSAP',
    description:
      'Used for timeline composition, eased entry motion, and orchestration of non-frame content.'
  },
  {
    title: 'ScrollTrigger',
    description:
      'Attaches animation progress to scroll position with scrub support while preserving native input.'
  },
  {
    title: 'Canvas image sequence',
    description:
      'The most stable option for premium frame-accurate stories, especially when precise seeking matters.'
  },
  {
    title: 'Video currentTime scrub',
    description:
      'Useful for lighter prototypes when the source is encoded with dense keyframes and the device budget is known.'
  }
];

export const playgroundImplementationModes: ContentCollection[] = [
  {
    eyebrow: 'Recommended mode',
    title: 'Frame sequence on a fixed full-screen canvas',
    description:
      'This is the pattern used in the landing because it is the most reliable way to preserve visual precision.',
    items: [
      {
        title: 'Scrub a frame index',
        description:
          'Animate a plain object value and redraw the canvas when the frame changes.'
      },
      {
        title: 'Preload the scene',
        description:
          'Cache the first stretch of the sequence so the opening does not hitch.'
      },
      {
        title: 'Keep native scroll',
        description:
          'Let ScrollTrigger listen to scroll instead of hijacking it.'
      }
    ]
  },
  {
    eyebrow: 'Alternative mode',
    title: 'Video currentTime with all-keyframe encoding',
    description:
      'The shorter video approach works best for controlled demos, but it is more sensitive to codec and seek behavior.',
    items: [
      {
        title: 'Encode for scrubbing',
        description:
          'Use an all-intra or very dense keyframe layout so arbitrary seeks do not smear or stall.'
      },
      {
        title: 'Prime playback on iOS',
        description:
          'Touch activation is still important for inline playback surfaces on mobile Safari.'
      },
      {
        title: 'Expect tradeoffs',
        description:
          'A single compressed video is lighter to manage, but less deterministic than a curated frame manifest.'
      }
    ]
  }
];

export const playgroundCodeSnippets: CodeSnippet[] = [
  {
    eyebrow: 'Library setup',
    title: 'Register GSAP and ScrollTrigger once.',
    description:
      'The scroll-linked layer only needs a single plugin registration before timelines are created.',
    language: 'ts',
    code: `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);`
  },
  {
    eyebrow: 'Image-sequence scrub',
    title: 'Drive a frame value from scroll progress.',
    description:
      'This mirrors the premium sticky-canvas pattern used by Apple-style sequence sites and the Builder walkthrough.',
    language: 'ts',
    code: `const state = { frame: 0 };\nconst totalFrames = images.length - 1;\n\ngsap.to(state, {\n  frame: totalFrames,\n  ease: 'none',\n  scrollTrigger: {\n    trigger: container,\n    start: 'top top',\n    end: 'bottom bottom',\n    scrub: 1\n  },\n  onUpdate: () => drawFrame(Math.round(state.frame))\n});`
  },
  {
    eyebrow: 'Video scrub',
    title: 'Use currentTime when the source is encoded for seeking.',
    description:
      'For lightweight demos, ScrollTrigger can tween a muted video element through its duration.',
    language: 'ts',
    code: `gsap.timeline({\n  scrollTrigger: {\n    trigger: container,\n    start: 'top top',\n    end: 'bottom bottom',\n    scrub: true\n  }\n}).fromTo(video, {\n  currentTime: 0\n}, {\n  currentTime: video.duration || 1,\n  ease: 'none'\n});`
  },
  {
    eyebrow: 'FFmpeg prep',
    title: 'Prepare a video for scrub-heavy playback.',
    description:
      'Dense keyframes reduce seek artifacts when you must drive currentTime directly.',
    language: 'bash',
    code: `ffmpeg -i source.mov \\\n  -movflags faststart \\\n  -vcodec libx264 \\\n  -crf 20 \\\n  -g 1 \\\n  -pix_fmt yuv420p \\\n  scrub-ready.mp4`
  }
];

export const landingImmersiveConfig = {
  scrollbar: {
    enabled: true,
    position: 'right',
    width: 10,
    radius: 999,
    trackOpacity: 0.2,
    thumbOpacity: 0.96,
    autoHide: false,
    visibilityMode: 'manual',
    offset: 22,
    minThumbSize: 88,
    trackColor: 'rgba(255, 255, 255, 0.18)',
    thumbColor: '#8de1ff',
    transitionDuration: 180,
    zIndex: 5
  },
  visual: {
    overlayOpacity: 0.18,
    backgroundColor: '#050912',
    brightness: 0.9,
    contrast: 1.06,
    saturate: 1.08,
    blur: 0,
    objectFit: 'cover',
    objectPosition: 'center center'
  },
  debug: {
    enabled: false,
    showFrameIndex: true,
    showProgress: true,
    showVelocity: true,
    showManifestStatus: true
  }
} as const;
