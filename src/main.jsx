import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App.jsx'
import { blockCopy, guard } from './protect'

// fora do domínio do Jonh (cópia), guard() manda para o site original e o React nem monta
if (guard()) {
  blockCopy()
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
