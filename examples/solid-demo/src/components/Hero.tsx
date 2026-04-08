import { ImmersiveFloating, ImmersiveScroll } from 'immersive-scroll/solid';
import {
  landingDocsCards,
  landingFeatureCards,
  landingFrameworkCards,
  landingHero,
  landingImmersiveConfig,
  landingMetrics,
  landingSections,
  landingSource
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
      class="immersive-stage"
      framesPath="/immersive/ocean"
      config={solidLandingConfig}
    >
      <div class="story-stack">
        <section class="story-panel story-panel--left" id="hero">
          <article class="story-card">
            <p class="eyebrow">{landingHero.eyebrow}</p>
            <h2>{landingHero.title}</h2>
            <p>{landingHero.description}</p>
            <div class="landing-metrics">
              {landingMetrics.map((metric) => (
                <span>
                  {metric.label}: {metric.value}
                </span>
              ))}
            </div>
            <ImmersiveFloating>
              <div class="story-meta">
                <span>{landingSource.title}</span>
                <span>{landingSource.label}</span>
                <span>{landingSource.license}</span>
              </div>
            </ImmersiveFloating>
          </article>
        </section>

        {landingSections.map((section) => (
          <section
            class={`story-panel story-panel--${section.align}`}
            id={section.id}
          >
            <article class="story-card">
              <p class="story-index">{section.index}</p>
              <p class="eyebrow">{section.eyebrow}</p>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <div class="story-meta">
                {section.detailChips.map((detailChip) => (
                  <span>{detailChip}</span>
                ))}
              </div>
            </article>
          </section>
        ))}

        <section
          class="landing-grid-section landing-grid-section--left"
          id="features"
        >
          <div class="landing-grid-layout landing-grid-layout--features">
            {landingFeatureCards.map((featureCard) => (
              <article class="landing-grid-card">
                <p class="eyebrow">Feature</p>
                <h3>{featureCard.title}</h3>
                <p>{featureCard.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          class="landing-grid-section landing-grid-section--right"
          id="frameworks"
        >
          <div class="landing-grid-layout landing-grid-layout--frameworks">
            {landingFrameworkCards.map((frameworkCard) => (
              <article class="landing-grid-card">
                <p class="eyebrow">Adapter</p>
                <h3>{frameworkCard.title}</h3>
                <p>{frameworkCard.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          class="landing-grid-section landing-grid-section--left"
          id="docs"
        >
          <div class="landing-grid-layout landing-grid-layout--docs">
            {landingDocsCards.map((docsCard) => (
              <article class="landing-grid-card">
                <p class="eyebrow">Docs</p>
                <h3>{docsCard.title}</h3>
                <p>{docsCard.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ImmersiveScroll>
  );
}
