import { useState } from 'react';
import { Hero } from './components/Hero';

export function App() {
  const [debug, setDebug] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(true);

  return (
    <Hero
      debug={debug}
      showScrollbar={showScrollbar}
      onToggleDebug={() => setDebug((value) => !value)}
      onToggleScrollbar={() => setShowScrollbar((value) => !value)}
    />
  );
}
