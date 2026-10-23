import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from '../hooks'

// Criar um canvas WebGL custa uma travadinha (~100 ms). Por isso as cenas são criadas
// logo depois do carregamento, uma de cada vez e com o navegador ocioso — enquanto a pessoa
// ainda lê o topo — e não no meio da rolagem. Se a pessoa rolar antes disso, a cena é
// criada quando estiver a ~2,5 telas de distância. Ela só anima quando está visível (Stage).
let queue = 0

export default function LazyScene({ load, className, rootMargin = '2400px 0px' }) {
  const ref = useRef(null)
  const near = useInView(ref, { rootMargin, once: true })
  const [mounted, setMounted] = useState(false)
  const Scene = useMemo(() => lazy(load), [load])
  const slot = useMemo(() => queue++, [])

  useEffect(() => {
    if (mounted) return
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1))
    const cancel = window.cancelIdleCallback || clearTimeout
    let timer
    let idleId
    const schedule = (delay) => {
      timer = setTimeout(() => (idleId = idle(() => setMounted(true), { timeout: 1500 })), delay)
    }
    if (near) schedule(0)
    else {
      const onLoad = () => schedule(1200 + slot * 900)
      if (document.readyState === 'complete') onLoad()
      else window.addEventListener('load', onLoad, { once: true })
      return () => {
        window.removeEventListener('load', onLoad)
        clearTimeout(timer)
        if (idleId) cancel(idleId)
      }
    }
    return () => {
      clearTimeout(timer)
      if (idleId) cancel(idleId)
    }
  }, [near, mounted, slot])

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {mounted && (
        <Suspense fallback={null}>
          <Scene className="scene-fill" />
        </Suspense>
      )}
    </div>
  )
}
