import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { coinFaceTexture } from './shapes'
import { matcap } from './matcaps'

let glowTex
export function glowTexture() {
  if (glowTex) return glowTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,.45)')
  grad.addColorStop(0.6, 'rgba(255,255,255,.08)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  glowTex = new THREE.CanvasTexture(c)
  return glowTex
}

// Brilho suave (sprite aditivo): o "bloom" sem pós-processamento. Manter dentro do enquadramento da câmera.
export function Glow({ color = '#8f5bff', scale = 2, opacity = 1, ...props }) {
  return (
    <sprite scale={scale} {...props}>
      <spriteMaterial
        map={glowTexture()}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  )
}

// Flutuação suave (substitui o Float do drei).
export function Bob({ speed = 1.4, amp = 0.12, tilt = 0.12, children, ...props }) {
  const ref = useRef()
  const seed = useMemo(() => Math.random() * 10, [])
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + seed
    ref.current.position.y = Math.sin(t) * amp
    ref.current.rotation.x = Math.cos(t * 0.6) * tilt * 0.5
    ref.current.rotation.z = Math.sin(t * 0.5) * tilt * 0.5
  })
  return (
    <group {...props}>
      <group ref={ref}>{children}</group>
    </group>
  )
}

// Poeira brilhante (substitui o Sparkles do drei): um único draw call.
export function Dust({ count = 30, size = [6, 4, 3], color = '#ffffff', pointSize = 0.08, ...props }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * size[0]
      p[i * 3 + 1] = (Math.random() - 0.5) * size[1]
      p[i * 3 + 2] = (Math.random() - 0.5) * size[2]
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
    // size é lido só na montagem: um array literal novo a cada render recriaria a geometria
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.05
    ref.current.material.opacity = 0.65 + Math.sin(state.clock.elapsedTime * 1.3) * 0.2
  })
  return (
    <points ref={ref} geometry={geo} {...props}>
      <pointsMaterial
        map={glowTexture()}
        color={color}
        size={pointSize}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

// Moeda prateada com "R$" em violeta. Balança em vez de girar inteira, para nunca aparecer de perfil (fina demais).
export function Coin({ radius = 0.55, swing = 0.6, speed = 1, ...props }) {
  const ref = useRef()
  const face = useMemo(() => coinFaceTexture(), [])
  const seed = useMemo(() => Math.random() * 10, [])
  const h = radius * 0.2
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed + seed) * swing
  })
  return (
    <group {...props}>
      <group ref={ref}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[radius, radius, h, 48]} />
          <meshMatcapMaterial matcap={matcap.chrome()} />
        </mesh>
        <mesh position-z={h / 2 + 0.002}>
          <circleGeometry args={[radius * 0.97, 48]} />
          <meshMatcapMaterial matcap={matcap.pearl()} map={face} />
        </mesh>
        <mesh position-z={-(h / 2 + 0.002)} rotation-y={Math.PI}>
          <circleGeometry args={[radius * 0.97, 48]} />
          <meshMatcapMaterial matcap={matcap.pearl()} map={face} />
        </mesh>
      </group>
    </group>
  )
}
