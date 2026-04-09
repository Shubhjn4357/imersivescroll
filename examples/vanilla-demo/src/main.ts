import { createImmersiveInstance } from 'immersive-scroll/web';
import {
  defaultSceneFramesPath,
  landingDocsCards,
  landingFeatureCards,
  landingFrameworkCards,
  landingHero,
  landingImmersiveConfig,
  landingMetrics,
  landingSections,
  landingSource
} from '../../shared/landing-content';
import './styles.css';

const heroElement = document.querySelector<HTMLElement>('#hero');

if (!heroElement) {
  throw new Error('Missing hero mount element.');
}

const vanillaLandingConfig = {
  ...landingImmersiveConfig,
  scrollbar: {
    ...landingImmersiveConfig.scrollbar,
    visibilityMode: 'always' as const
  }
};

const instance = createImmersiveInstance({
  container: heroElement,
  framesPath: defaultSceneFramesPath,
  config: vanillaLandingConfig
});

const renderMetricMarkup = landingMetrics
  .map((metric) => `<span>${metric.label}: ${metric.value}</span>`)
  .join('');

const renderStoryMarkup = landingSections
  .map(
    (section) => `
      <section class="story-panel story-panel--${section.align}" id="${section.id}">
        <article class="story-card">
          <p class="story-index">${section.index}</p>
          <p class="eyebrow">${section.eyebrow}</p>
          <h3>${section.title}</h3>
          <p>${section.description}</p>
          <div class="story-meta">
            ${section.detailChips.map((detailChip) => `<span>${detailChip}</span>`).join('')}
          </div>
        </article>
      </section>
    `
  )
  .join('');

const renderCardMarkup = (
  label: string,
  title: string,
  description: string
) => `
  <article class="landing-grid-card">
    <p class="eyebrow">${label}</p>
    <h3>${title}</h3>
    <p>${description}</p>
  </article>
`;

instance.overlay.className = 'immersive-overlay';
instance.overlay.innerHTML = `
  <div class="landing-vignette"></div>
  <div class="landing-status" id="landing-status">
    <strong>Scene status</strong>
    <span>Progress 0%</span>
    <span>Frame 1/1</span>
  </div>
  <div class="landing-source">
    <strong>${landingSource.title}</strong>
    <span>${landingSource.label}</span>
    <span>${landingSource.license}</span>
  </div>
`;

instance.content.innerHTML = `
  <div class="story-stack">
    <section class="story-panel story-panel--left" id="hero">
      <article class="story-card">
        <p class="eyebrow">${landingHero.eyebrow}</p>
        <h2>${landingHero.title}</h2>
        <p>${landingHero.description}</p>
        <div class="landing-metrics">${renderMetricMarkup}</div>
      </article>
    </section>

    ${renderStoryMarkup}

    <section class="landing-grid-section landing-grid-section--left" id="features">
      <div class="landing-grid-layout landing-grid-layout--features">
        ${landingFeatureCards.map((card) => renderCardMarkup('Feature', card.title, card.description)).join('')}
      </div>
    </section>

    <section class="landing-grid-section landing-grid-section--right" id="frameworks">
      <div class="landing-grid-layout landing-grid-layout--frameworks">
        ${landingFrameworkCards.map((card) => renderCardMarkup('Adapter', card.title, card.description)).join('')}
      </div>
    </section>

    <section class="landing-grid-section landing-grid-section--left" id="docs">
      <div class="landing-grid-layout landing-grid-layout--docs">
        ${landingDocsCards.map((card) => renderCardMarkup('Docs', card.title, card.description)).join('')}
      </div>
    </section>
  </div>
`;

const statusElement =
  instance.overlay.querySelector<HTMLElement>('#landing-status');
const statusLines = statusElement?.querySelectorAll('span');

const updateStatus = () => {
  const progressLine = statusLines?.item(0);
  const frameLine = statusLines?.item(1);

  if (!progressLine || !frameLine) {
    return;
  }

  const state = instance.engine.getState();
  const currentFrame = Math.min(
    state.frame.currentFrame + 1,
    Math.max(state.frame.totalFrames, 1)
  );
  const totalFrames = Math.max(state.frame.totalFrames, 1);

  progressLine.textContent = `Progress ${Math.round(state.scroll.progress * 100)}%`;
  frameLine.textContent = `Frame ${currentFrame}/${totalFrames}`;
};

const unsubscribeFrame = instance.engine.subscribeFrame(updateStatus);
const unsubscribeScroll = instance.engine.subscribeScroll(updateStatus);

updateStatus();

window.addEventListener('beforeunload', () => {
  unsubscribeFrame();
  unsubscribeScroll();
  instance.destroy();
});
