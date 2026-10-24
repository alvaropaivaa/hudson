import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Hero from './components/Hero'
import { Clouds, Funnel, Goal, Growth, Plan, Stats, Strategy, Value, Why } from './components/Sections'
import Diagnostico from './components/Diagnostico'
import { FloatingBar, Footer } from './components/Footer'
import LeadPopup from './components/LeadPopup'
import { prefersReducedMotion } from './hooks'
import { guard } from './protect'

gsap.registerPlugin(ScrollTrigger)

function useScrollMotion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.15 })

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          // limpa o transform no fim para não travar o tilt 3D dos cards
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.fromTo(
        '.wallet-word',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.wallet', start: 'top 80%', end: 'top 10%', scrub: true },
        },
      )

      // nuvens em 3 camadas com velocidades diferentes, como no base
      const clouds = { trigger: '.clouds', start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.clouds-layer--back', { yPercent: 35 }, { yPercent: -5, ease: 'none', scrollTrigger: clouds })
      gsap.fromTo('.clouds-layer--mid', { yPercent: 20 }, { yPercent: -15, ease: 'none', scrollTrigger: clouds })
      gsap.fromTo('.clouds-layer--front', { yPercent: 10 }, { yPercent: -35, ease: 'none', scrollTrigger: clouds })

      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const obj = { v: 0 }
        el.textContent = '0'
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        })
      })

      gsap.fromTo(
        '.process-line-active',
        { '--p': 0 },
        {
          '--p': 1,
          ease: 'none',
          scrollTrigger: { trigger: '.process-stage', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      )
      gsap.utils.toArray('.process-step').forEach((step) =>
        ScrollTrigger.create({
          trigger: step,
          start: 'top 66%',
          onEnter: () => step.classList.add('is-on'),
          onLeaveBack: () => step.classList.remove('is-on'),
        }),
      )
    })

    // recalcula posições quando fontes/imagens terminam de carregar
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
      gsap.ticker.remove(tick)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}

// Baixa o código 3D quando o navegador fica ocioso, depois do hero carregar:
// quando a pessoa rolar até as cenas, elas já estão prontas.
function usePrefetch3D() {
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200))
    const cancel = window.cancelIdleCallback || clearTimeout
    const start = () => {
      import('./three/GrowthScene')
      import('./three/FunnelScene')
      import('./three/TargetScene')
    }
    let id
    const onLoad = () => (id = idle(start, { timeout: 2500 }))
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => {
      window.removeEventListener('load', onLoad)
      if (id) cancel(id)
    }
  }, [])
}

// Pausa as animações CSS infinitas das seções que estão fora da tela (o navegador
// continuaria recalculando essas animações mesmo sem ninguém ver).
function usePauseOffscreen() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-anim]')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
      { rootMargin: '100px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  // segunda checagem do domínio (se alguém tirar a primeira do main.jsx numa cópia)
  useEffect(() => {
    const t = setTimeout(guard, 2500)
    return () => clearTimeout(t)
  }, [])
  useScrollMotion()
  usePrefetch3D()
  usePauseOffscreen()
  return (
    <>
      <main>
        <Hero />
        <Value />
        <Growth />
        <Stats />
        <Clouds />
        <Funnel />
        <Plan />
        <Why />
        <Strategy />
        <Goal />
        <Diagnostico />
      </main>
      <Footer />
      <FloatingBar />
      <LeadPopup />
    </>
  )
}
