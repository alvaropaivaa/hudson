import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Obrigado from './components/Obrigado.jsx'
import { blockCopy, guard } from './protect'

if (guard()) {
  blockCopy()
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Obrigado />
    </StrictMode>,
  )
}
