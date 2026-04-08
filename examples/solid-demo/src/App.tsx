import { Hero } from './components/Hero';

export function App() {
  return (
    <main class="landing-shell">
      <header class="landing-nav">
        <div class="landing-brand">
          <p class="eyebrow">Solid Demo</p>
          <h1>Shared landing content in a signal-first adapter.</h1>
        </div>
        <div class="landing-actions">
          <a class="landing-link" href="#frameworks">
            Frameworks
          </a>
          <a class="landing-link landing-link--accent" href="#docs">
            Docs
          </a>
        </div>
      </header>

      <Hero />

      <footer class="landing-footer">
        <span>
          The Solid example reads the same story definition from
          `examples/shared/`.
        </span>
        <span>Use the Next demo for the primary live-edit surface.</span>
      </footer>
    </main>
  );
}
