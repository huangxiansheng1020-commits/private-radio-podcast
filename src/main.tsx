import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { PlayerProvider } from './PlayerContext'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined))
}
