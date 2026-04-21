import {
  ImmersiveScrollytelling,
  useImmersiveConfigControls,
  type ScrollytellingStep
} from 'immersive-scroll';

const narrativeSteps: ScrollytellingStep[] = [
  {
    id: 'hero',
    start: 0.0,
    end: 0.15,
    placement: 'center',
    content: (
      <div style={{ textAlign: 'center' }}>
        <span className="text-accent">Introducing Vector</span>
        <h1 className="text-hero">The Pinnacle of Engineering.</h1>
        <p className="text-subtitle" style={{ margin: '0 auto' }}>
          Experience a design where zero compromises were made.
        </p>
      </div>
    )
  },
  {
    id: 'disassembly',
    start: 0.15,
    end: 0.4,
    placement: 'left',
    content: (
      <div>
        <span className="text-accent">Transparent Design</span>
        <h2 className="text-title">Nothing to hide.</h2>
        <p className="text-subtitle">
          Every layer operates in perfect harmony. We disassembled the chassis
          to show you exactly what power looks like.
        </p>
      </div>
    )
  },
  {
    id: 'explosion',
    start: 0.4,
    end: 0.65,
    placement: 'right',
    content: (
      <div>
        <span className="text-accent">Core Architecture</span>
        <h2 className="text-title">Custom Silicon.</h2>
        <p className="text-subtitle">
          Our proprietary logic board processes millions of operations per
          second without ever heating up.
        </p>
      </div>
    )
  },
  {
    id: 'highlight',
    start: 0.65,
    end: 0.85,
    placement: 'left',
    content: (
      <div>
        <span className="text-accent">Acoustic Chambers</span>
        <h2 className="text-title">Pure Sound.</h2>
        <p className="text-subtitle">
          Precision-machined audio chambers deliver high-fidelity resonance
          directly to your ears.
        </p>
      </div>
    )
  },
  {
    id: 'reassembly',
    start: 0.85,
    end: 1.0,
    placement: 'center',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h2 className="text-title">Ready for you.</h2>
        <a href="#" className="cta-button">
          Pre-order Vector
        </a>
      </div>
    )
  }
];

export function Hero() {
  const sceneControls = useImmersiveConfigControls({
    initialConfig: {
      debug: { enabled: false },
      scrollbar: { enabled: false }
    }
  });

  return (
    <>
      <nav className="nav-glass">
        <div className="nav-brand">Vector</div>
        <div>
          <a
            href="#"
            className="nav-button"
            onClick={(e) => {
              e.preventDefault();
              sceneControls.updateDebug({
                enabled: !sceneControls.config.debug?.enabled
              });
            }}
          >
            Toggle Debug
          </a>
        </div>
      </nav>

      <ImmersiveScrollytelling
        config={sceneControls.config}
        manifestPath="/immersive/scene/manifest.json"
        steps={narrativeSteps}
      />
    </>
  );
}
