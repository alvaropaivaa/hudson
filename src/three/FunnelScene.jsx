import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Stage from './Stage'
import { Coin } from './Pieces'
import { matcap } from './matcaps'

// Perfil do funil (raio, altura), de baixo para cima.
const PROFILE = [
  [0.17, -2.05],
  [0.2, -1.5],
  [0.3, -1.0],
  [0.62, -0.4],
  [1.15, 0.25],
  [1.75, 0.95],
  [2.15, 1.5],
]
const TOP = 1.5
const BOTTOM = -2.05
const SPAWN = 3.3
const LOOK = [0, -0.2, 0]

function funnelRadius(y) {
  if (y >= TOP) return PROFILE[PROFILE.length - 1][0]
  if (y <= BOTTOM) return PROFILE[0][0]
  for (let i = 1; i < PROFILE.length; i++) {
    const [r1, y1] = PROFILE[i]
    const [r0, y0] = PROFILE[i - 1]
    if (y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0)
  }
  return PROFILE[0][0]
}

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

function LookAt() {
  const camera = useThree((s) => s.camera)
  useLayoutEffect(() => camera.lookAt(...LOOK), [camera])
  return null
}

// Partículas = pessoas impactadas pelo anúncio. Entram espalhadas, afunilam e saem como clientes.
function Leads({ count }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        phase: Math.random(),
        angle: Math.random() * Math.PI * 2,
        speed: 0.07 + Math.random() * 0.05,
        spread: 1.5 + Math.random() * 1.1,
        rf: 0.25 + Math.random() * 0.68,
      })),
    [count],
  )
  const colors = useMemo(
    () => ({ far: new THREE.Color('#c9b2ff'), mid: new THREE.Color('#8a4dff'), end: new THREE.Color('#4a12d8'), tmp: new THREE.Color() }),
    [],
  )
  const t = useRef(0)

  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.1)
    const { far, mid, end, tmp } = colors
    seeds.forEach((s, i) => {
      const u = (s.phase + t.current * s.speed) % 1
      const y = THREE.MathUtils.lerp(SPAWN, -3.1, u)
      const inside = smooth(2.6, 1.35, y)
      const r = THREE.MathUtils.lerp(s.spread, funnelRadius(y) * s.rf, inside)
      const a = s.angle + u * 7.5
      dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
      // nasce do zero no topo e some ao chegar na moeda: nada é cortado na borda do canvas
      const born = smooth(SPAWN, SPAWN - 0.5, y)
      const gone = 1 - smooth(-2.6, -3.05, y)
      dummy.scale.setScalar((0.6 + inside * 0.5) * born * gone + 0.0001)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      if (y > 0.2) tmp.copy(far).lerp(mid, inside)
      else tmp.copy(mid).lerp(end, smooth(0.2, -2.2, y))
      mesh.current.setColorAt(i, tmp)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshMatcapMaterial matcap={matcap.pearl()} />
    </instancedMesh>
  )
}

let shadowTex
function shadowTexture() {
  if (shadowTex) return shadowTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(40,16,110,.45)')
  grad.addColorStop(0.5, 'rgba(40,16,110,.14)')
  grad.addColorStop(1, 'rgba(40,16,110,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  shadowTex = new THREE.CanvasTexture(c)
  return shadowTex
}

function Funnel() {
  const group = useRef()
  const { size } = useThree()
  const { solid, wire } = useMemo(() => {
    const pts = PROFILE.map(([r, y]) => new THREE.Vector2(r, y))
    return {
      solid: new THREE.LatheGeometry(new THREE.SplineCurve(pts).getPoints(40), 72),
      wire: new THREE.LatheGeometry(new THREE.SplineCurve(pts).getPoints(14), 28),
    }
  }, [])

  useFrame((state) => {
    const g = group.current
    g.rotation.y = state.clock.elapsedTime * 0.18
  })

  return (
    <group>
      <group ref={group}>
        <mesh geometry={solid} renderOrder={1}>
          <meshMatcapMaterial matcap={matcap.glass()} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh geometry={wire}>
          <meshBasicMaterial color="#7a2cff" wireframe transparent opacity={0.16} depthWrite={false} />
        </mesh>
        {[
          [2.15, 1.5, 0.04],
          [1.15, 0.25, 0.028],
          [0.3, -1.0, 0.022],
        ].map(([r, y, tube], i) => (
          <mesh key={i} position-y={y} rotation-x={Math.PI / 2}>
            <torusGeometry args={[r, tube, 12, 120]} />
            <meshMatcapMaterial matcap={matcap.violet()} />
          </mesh>
        ))}
      </group>
      <Leads count={size.width < 700 ? 130 : 220} />
      <Coin radius={0.5} speed={1.4} position={[0, -2.95, 0]} />
      {/* sombra pronta em textura (no lugar do ContactShadows, que renderizava a cena de novo) */}
      <mesh position-y={-3.55} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial map={shadowTexture()} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function FunnelScene({ className }) {
  return (
    <Stage className={className} env={false} camera={{ position: [0, 2.4, 9.6], fov: 40 }}>
      <LookAt />
      <Funnel />
    </Stage>
  )
}
