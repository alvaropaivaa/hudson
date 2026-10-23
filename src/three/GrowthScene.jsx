import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import Stage from './Stage'
import { Bob, Coin, Dust, Glow } from './Pieces'
import { matcap } from './matcaps'
import { pointer, prefersReducedMotion } from '../hooks'

const BARS = [0.8, 1.25, 1.75, 2.35, 3.1]
const BAR_X = [-1.36, -0.68, 0, 0.68, 1.36]
const TOP = 0.22
const LOOK = [0, 1.85, 0]

const easeOut = (k) => 1 - Math.pow(1 - k, 3)
const clamp01 = (v) => Math.min(Math.max(v, 0), 1)

function LookAt() {
  const camera = useThree((s) => s.camera)
  useLayoutEffect(() => camera.lookAt(...LOOK), [camera])
  return null
}

// Barras de vidro com núcleo de luz num pedestal escuro, e a linha de crescimento se desenhando.
function Chart() {
  const group = useRef()
  const bars = useRef([])
  const tube = useRef()
  const head = useRef()
  const headGlow = useRef()
  const t = useRef(prefersReducedMotion() ? 99 : 0)

  const { barGeos, tubeGeo, end, headQuat, coreColors } = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(
      [
        [-1.9, 1.3, 0.55],
        [-0.95, 1.75, 0.6],
        [-0.15, 2.1, 0.6],
        [0.5, 2.8, 0.6],
        [1.55, 3.95, 0.6],
      ].map((p) => new THREE.Vector3(...p)),
    )
    return {
      barGeos: BARS.map((h) => new RoundedBoxGeometry(0.5, h, 0.5, 3, 0.09)),
      tubeGeo: new THREE.TubeGeometry(c, 120, 0.045, 10, false),
      end: c.getPoint(1),
      headQuat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.getTangent(1).normalize()),
      coreColors: BARS.map((_, i) => new THREE.Color('#9d6bff').lerp(new THREE.Color('#ffffff'), i / (BARS.length - 1))),
    }
  }, [])

  useFrame((state, dt) => {
    t.current += Math.min(dt, 0.1)
    const time = t.current
    bars.current.forEach((b, i) => {
      if (b) b.scale.y = Math.max(0.001, easeOut(clamp01((time - 0.2 - i * 0.16) / 0.95)))
    })
    const line = easeOut(clamp01((time - 1.15) / 1.2))
    tube.current.geometry.setDrawRange(0, Math.floor((line * tubeGeo.index.count) / 6) * 6)
    const hs = line >= 0.999 ? THREE.MathUtils.lerp(head.current.scale.x, 1, 0.15) : 0.001
    head.current.scale.setScalar(hs)
    headGlow.current.material.opacity = hs * (0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.15)
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + pointer.x * 0.1,
      0.05,
    )
  })

  return (
    <group ref={group}>
      {/* pedestal: corpo cromado escuro + topo laqueado + aro de luz branca */}
      <mesh position-y={-0.02}>
        <cylinderGeometry args={[2.35, 2.5, 0.46, 64]} />
        <meshMatcapMaterial matcap={matcap.darkChrome()} />
      </mesh>
      <mesh position-y={TOP + 0.002} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.3, 64]} />
        <meshMatcapMaterial matcap={matcap.darkChrome()} color="#8a84b8" />
      </mesh>
      <mesh position-y={TOP} rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.33, 0.028, 12, 128]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      {/* poça de luz violeta no topo do pedestal, debaixo das barras */}
      <mesh position-y={TOP + 0.01} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4.2, 2.2]} />
        <meshBasicMaterial
          map={glowPool()}
          color="#9d6bff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {BARS.map((hgt, i) => (
        <group key={i} position={[BAR_X[i], TOP, 0]} ref={(el) => (bars.current[i] = el)} scale-y={0.001}>
          <mesh position-y={hgt / 2}>
            <boxGeometry args={[0.16, hgt - 0.16, 0.16]} />
            <meshBasicMaterial color={coreColors[i]} toneMapped={false} />
          </mesh>
          <mesh geometry={barGeos[i]} position-y={hgt / 2} renderOrder={1}>
            <meshMatcapMaterial matcap={matcap.glass()} transparent opacity={0.38} depthWrite={false} />
          </mesh>
        </group>
      ))}

      <mesh ref={tube} geometry={tubeGeo}>
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh ref={head} position={end} quaternion={headQuat} scale={0.001}>
        <coneGeometry args={[0.18, 0.4, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <Glow ref={headGlow} color="#d9c6ff" scale={1.1} position={end} opacity={0} />

      <Bob speed={1.5} amp={0.14}>
        <Coin radius={0.42} position={[-2.15, 2.85, -0.3]} rotation={[0.1, 0.3, 0]} />
      </Bob>
      <Bob speed={1.9} amp={0.12}>
        <Coin radius={0.3} speed={1.3} position={[2.25, 1.5, 0.7]} rotation={[-0.2, -0.3, 0]} />
      </Bob>
    </group>
  )
}

let poolTex
function glowPool() {
  if (poolTex) return poolTex
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const g = c.getContext('2d')
  // gradiente circular esticado 2x na horizontal = elipse que preenche a textura
  g.setTransform(2, 0, 0, 1, 0, 0)
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,.75)')
  grad.addColorStop(0.5, 'rgba(255,255,255,.18)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  poolTex = new THREE.CanvasTexture(c)
  return poolTex
}

export default function GrowthScene({ className }) {
  return (
    <Stage className={className} camera={{ position: [0, 2.5, 9.6], fov: 36 }}>
      <LookAt />
      {/* luz violeta atrás das barras (cabe inteira no enquadramento, sem borda cortada) */}
      <Glow color="#6d2cff" scale={5.6} position={[0, 2.1, -3]} opacity={0.85} />
      <Chart />
      <Dust count={36} size={[6, 4, 2.5]} position={[0, 2.1, 0]} />
    </Stage>
  )
}
