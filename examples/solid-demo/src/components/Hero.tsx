import { ImmersiveScroll } from 'immersive-scroll/solid';
import {
  defaultSceneFramesPath,
  landingHero,
  landingImmersiveConfig,
  landingSections
} from '../../../shared/landing-content';

const solidLandingConfig = {
  ...landingImmersiveConfig,
  scrollbar: {
    ...landingImmersiveConfig.scrollbar,
    visibilityMode: 'always' as const
  }
};

export function Hero() {
  return (
    <ImmersiveScroll
      class="demo-scene"
      framesPath={defaultSceneFramesPath}
      config={solidLandingConfig}
      style={{ 'min-height': '400vh' }}
    >
      <div class="demo-scene__content">
        <section class="story-panel story-panel--center" id="hero">
          <div style={{ 'max-width': '800px' }}>
            <span class="text-accent">Solid + Canvas</span>
            <h1 class="text-hero">{landingHero.title}</h1>
            <p class="text-subtitle" style={{ margin: '0 auto' }}>
              {landingHero.description}
            </p>
          </div>
        </section>

        {landingSections.map((section) => (
          <section
            class={`story-panel story-panel--${section.align}`}
            id={section.id}
          >
            <article
              class="story-card"
              style={{
                'max-width': '450px',
                background: 'rgba(5,5,5,0.4)',
                'backdrop-filter': 'blur(12px)'
              }}
            >
              <span class="text-accent">{section.eyebrow}</span>
              <h2 class="text-title" style={{ 'font-size': '2.5rem' }}>
                {section.title}
              </h2>
              <p class="text-subtitle">{section.description}</p>
            </article>
          </section>
        ))}

        <section class="story-panel story-panel--center" id="features">
          <div style={{ 'text-align': 'center' }}>
            <h2 class="text-title">Solid Signal Performance</h2>
            <p class="text-subtitle" style={{ margin: '0 auto' }}>
              Experience lightning fast frame updates powered by Solid's
              fine-grained reactivity.
            </p>
          </div>
        </section>
      </div>
    </ImmersiveScroll>
  );
}
