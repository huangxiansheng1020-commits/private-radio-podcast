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
  window.addEventListener('load', () => {
    const hadController = Boolean(navigator.serviceWorker.controller)
    let refreshing = false

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !refreshing) {
        refreshing = true
        window.location.reload()
      }
    })

    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { updateViaCache: 'none' })
      .then((registration) => {
        void registration.update()
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') void registration.update()
        })
      })
      .catch(() => undefined)
  })
}
