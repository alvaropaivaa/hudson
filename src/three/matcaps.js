import * as THREE from 'three'

// Matcaps desenhados em canvas: a "esfera já iluminada" que o MeshMatcapMaterial usa.
// Shader minúsculo (sem luzes, sem mapa de ambiente) = compila na hora e roda leve em qualquer celular.
const cache = {}

function make(key, { base, shadow, rim, rimAlpha = 0.65, spec = 1 }) {
  if (cache[key]) return cache[key]
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  g.fillStyle = shadow
  g.fillRect(0, 0, S, S)

  // corpo: luz vindo de cima/esquerda
  const body = g.createRadialGradient(S * 0.36, S * 0.32, S * 0.02, S * 0.5, S * 0.5, S * 0.52)
  body.addColorStop(0, '#ffffff')
  body.addColorStop(0.18, base)
  body.addColorStop(0.75, base)
  body.addColorStop(1, shadow)
  g.fillStyle = body
  g.beginPath()
  g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2)
  g.fill()

  // borda iluminada (fresnel) puxada para baixo/direita
  const r = g.createRadialGradient(S * 0.46, S * 0.44, S * 0.36, S * 0.5, S * 0.5, S * 0.5)
  r.addColorStop(0, 'rgba(0,0,0,0)')
  r.addColorStop(0.85, 'rgba(0,0,0,0)')
  r.addColorStop(1, rim)
  g.globalAlpha = rimAlpha
  g.fillStyle = r
  g.fill()
  g.globalAlpha = 1

  // brilho especular
  const sp = g.createRadialGradient(S * 0.32, S * 0.27, 0, S * 0.32, S * 0.27, S * 0.13)
  sp.addColorStop(0, `rgba(255,255,255,${spec})`)
  sp.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = sp
  g.fillRect(0, 0, S, S)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  cache[key] = tex
  return tex
}

export const matcap = {
  pearl: () => make('pearl', { base: '#efecf7', shadow: '#9f97bd', rim: '#c9b2ff' }),
  violet: () => make('violet', { base: '#7a2cff', shadow: '#24086e', rim: '#d3bcff', rimAlpha: 0.8 }),
  lilac: () => make('lilac', { base: '#b48cff', shadow: '#5b2bc4', rim: '#ffffff' }),
  chrome: () => make('chrome', { base: '#c9c4dc', shadow: '#2d2650', rim: '#ffffff', rimAlpha: 0.9 }),
  glass: () => make('glass', { base: '#e6dcff', shadow: '#8f72d9', rim: '#ffffff', rimAlpha: 0.9 }),
  darkChrome: () => make('darkChrome', { base: '#2b2660', shadow: '#07061a', rim: '#9d6bff', rimAlpha: 0.9, spec: 0.7 }),
}
