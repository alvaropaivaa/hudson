import { useEffect, useState } from 'react'
import { AnchorLink } from './Cta'
import { IconWhatsApp } from './Icons'
import { SITE, waLink } from '../config'

const LINKS = [
  ['top', 'Início'],
  ['funil', 'Como funciona'],
  ['plano', 'Plano de ação'],
  ['diferenciais', 'Diferenciais'],
]

export function Brand({ className = '', dark = false }) {
  return (
    <span className={`brand ${dark ? 'brand--dark' : ''} ${className}`}>
      <span className="brand-name">{SITE.nome}</span>
      <span className="brand-role">Gestor de Tráfego</span>
    </span>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <AnchorLink to="top" aria-label={`${SITE.nome}, voltar ao início`}>
        <Brand />
      </AnchorLink>

      <nav className="nav-pill" aria-label="Navegação principal">
        {LINKS.slice(1).map(([id, label]) => (
          <AnchorLink key={id} to={id}>
            {label}
          </AnchorLink>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="menu-mobile" className="menu" hidden={!open}>
        <nav aria-label="Menu">
          {LINKS.map(([id, label], i) => (
            <AnchorLink key={id} to={id} onNavigate={() => setOpen(false)} style={{ '--i': i }}>
              {label}
            </AnchorLink>
          ))}
        </nav>
        <a className="menu-wa" href={waLink()} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp size={18} /> Falar no WhatsApp
        </a>
      </div>
    </header>
  )
}
