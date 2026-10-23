import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Obrigado from './components/Obrigado.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Obrigado />
  </StrictMode>,
)
