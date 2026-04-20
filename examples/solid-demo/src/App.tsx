import { Hero } from './components/Hero';

export function App() {
  return (
    <div class="site-chrome">
      <div class="site-grid" />

      <header class="site-nav">
        <a class="site-brand" href="/">
          <span
            class="text-accent"
            style={{ 'font-size': '0.65rem', margin: '0' }}
          >
            SOLID ADAPTER
          </span>
          <strong>immersive-scroll</strong>
        </a>
        <div style={{ display: 'flex', gap: '2rem', 'align-items': 'center' }}>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="#hero"
              style={{ 'font-size': '0.9rem', 'font-weight': '500' }}
            >
              Hero
            </a>
            <a
              href="#features"
              style={{ 'font-size': '0.9rem', 'font-weight': '500' }}
            >
              Features
            </a>
          </nav>
          <a href="#" class="nav-button">
            v0.1.1
          </a>
        </div>
      </header>

      <main class="home-shell" style={{ padding: '0', 'max-width': 'none' }}>
        <Hero />
      </main>

      <footer
        class="site-footer"
        style={{
          'border-top': '1px solid var(--border)',
          background: 'rgba(255,255,255,0.02)'
        }}
      >
        <div
          style={{
            'max-width': '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            'justify-content': 'space-between',
            'align-items': 'center'
          }}
        >
          <span style={{ 'font-size': '0.8rem', opacity: '0.5' }}>
            © 2026 Immersive Scroll • SolidJS Edition
          </span>
          <span style={{ 'font-size': '0.8rem', opacity: '0.5' }}>
            Powered by signal-first engine
          </span>
        </div>
      </footer>
    </div>
  );
}
