import { Component, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useInView, prefersReducedMotion } from '../hooks'

// Se o aparelho não tiver WebGL, a cena some e o resto da página segue normal.
class GLBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// Desenha no máximo 60 quadros por segundo e só enquanto a cena está na tela.
// (com frameloop "always", monitor de 144 Hz desenhava 144 vezes por segundo)
function Ticker({ running }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate() // primeiro quadro na montagem: os shaders compilam antes de a cena aparecer
    if (!running) return
    let raf
    let last = 0
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (now - last < 1000 / 61) return
      last = now
      invalidate()
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running, invalidate])
  return null
}

// Avisa depois do primeiro quadro desenhado para a cena entrar com fade.
function ReadySignal({ onReady }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    requestAnimationFrame(onReady)
  })
  return null
}

// Celular: até 1,5x (tela pequena, precisa de nitidez). PC: até 1,25x (canvas grande pesa mais).
const DPR =
  typeof window === 'undefined'
    ? 1
    : Math.min(window.devicePixelRatio || 1, window.matchMedia('(max-width: 900px)').matches ? 1.5 : 1.25)

// Todas as cenas usam matcap/basic: sem luzes nem mapa de ambiente para calcular.
export default function Stage({ className = '', camera, children }) {
  const ref = useRef(null)
  const active = useInView(ref, { rootMargin: '100px' })
  const [ready, setReady] = useState(false)
  const reduced = prefersReducedMotion()
  return (
    <div ref={ref} className={`stage ${className} ${ready ? 'is-ready' : ''}`} aria-hidden="true">
      <GLBoundary>
        <Canvas
          frameloop="demand"
          // mede só quando o tamanho muda de verdade: medir na rolagem fazia o canvas
          // "mudar de tamanho" durante o fade e realocar a memória da GPU (~150 ms travado)
          resize={{ scroll: false, debounce: { scroll: 0, resize: 150 } }}
          dpr={DPR}
          camera={camera}
          gl={{ alpha: true, antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
          onCreated={({ gl }) => {
            // se o contexto cair (aba em segundo plano), deixa o navegador restaurar
            gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
          }}
        >
          {children}
          <Ticker running={active && !reduced} />
          <ReadySignal onReady={() => setReady(true)} />
        </Canvas>
      </GLBoundary>
    </div>
  )
}
