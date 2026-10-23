import * as THREE from 'three'

// Face da moeda com "R$" desenhado em canvas (o three não traz mais fontes 3D).
export function coinFaceTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(190, 170, 20, 256, 256, 290)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.5, '#e4def5')
  grad.addColorStop(1, '#a89ec8')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 512)
  g.lineWidth = 14
  g.strokeStyle = 'rgba(122,44,255,.55)'
  g.beginPath()
  g.arc(256, 256, 212, 0, Math.PI * 2)
  g.stroke()
  g.fillStyle = '#6a22f5'
  // fonte do sistema: a do site pode não ter carregado quando a textura é desenhada
  g.font = '700 196px Arial, Helvetica, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.shadowColor = 'rgba(255,255,255,.9)'
  g.shadowOffsetY = 4
  g.fillText('R$', 256, 268)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
