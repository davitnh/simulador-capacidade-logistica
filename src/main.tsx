import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (window.parent !== window) {
  let lastHeight = 0;

  const sendHeight = (force = false) => {
    const height = Math.ceil(rootElement.getBoundingClientRect().height);

    if (height <= 0 || (!force && height === lastHeight)) return;

    lastHeight = height;
    window.parent.postMessage(
      { type: 'envoy-capacity-simulator-resize', height },
      '*',
    );
  };

  window.addEventListener('message', (event) => {
    if (
      event.source === window.parent &&
      event.data?.type === 'envoy-capacity-simulator-request-height'
    ) {
      sendHeight(true);
    }
  });

  const resizeObserver = new ResizeObserver(() => sendHeight());
  resizeObserver.observe(document.body);
  resizeObserver.observe(rootElement);

  window.addEventListener('resize', () => sendHeight());
  window.addEventListener('load', () => sendHeight(true));
  requestAnimationFrame(() => sendHeight(true));
}
