import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Stage from './Stage'
import { Bob, Dust, Glow } from './Pieces'
import { matcap } from './matcaps'
import { pointer, prefersReducedMotion } from '../hooks'

// anéis alternando cerâmica branca e vidro violeta; centro de luz branca
const RINGS = [
  [1.7, 'ceramic', 0.22],
  [1.38, 'glass', 0.28],
  [1.06, 'ceramic', 0.32],
  [0.74, 'glass', 0.36],
  [0.42, 'ceramic', 0.4],
]

const HIT = new THREE.Vector3(0.05, 0.05, 0.36)
const START = new THREE.Vector3(4.2, 3, 7)

function Target() {
  const group = useRef()
  const arrow = useRef()
  const flash = useRef()
  const t = useRef(prefersReducedMotion() ? 99 : 0)
  const quat = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(HIT, START, new THREE.Vector3(0, 1, 0))
    return new THREE.Quaternion().setFromRotationMatrix(m)
  }, [])
  const wobble = useMemo(() => new THREE.Quaternion(), [])
  const axis = useMemo(() => new THREE.Vector3(1, 0, 0), [])

  useFrame((state, dt) => {
    t.current += Math.min(dt, 0.1)
    const k = Math.min(Math.max((t.current - 0.35) / 0.6, 0), 1)
    arrow.current.position.lerpVectors(START, HIT, k * k)
    arrow.current.visible = k > 0
    const after = t.current - 0.95
    const amp = after > 0 ? Math.exp(-after * 3.2) * 0.16 * Math.sin(after * 26) : 0
    wobble.setFromAxisAngle(axis, amp)
    arrow.current.quaternion.copy(quat).multiply(wobble)
    // clarão no impacto
    flash.current.material.opacity = after > 0 ? 0.35 + Math.exp(-after * 2.5) * 1.2 : 0.35
    const g = group.current
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.16 + pointer.x * 0.1, 0.05)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.04 - pointer.y * 0.06, 0.05)
  })

  return (
    <Bob speed={1.2} amp={0.1} tilt={0.03}>
      <group ref={group} rotation-y={-0.16}>
        {RINGS.map(([r, kind, depth], i) => (
          <mesh key={i} rotation-x={Math.PI / 2} position-z={depth / 2 - 0.1}>
            <cylinderGeometry args={[r, r, depth, 72]} />
            <meshMatcapMaterial matcap={kind === 'ceramic' ? matcap.pearl() : matcap.violet()} />
          </mesh>
        ))}
        <mesh rotation-x={Math.PI / 2} position-z={0.26}>
          <cylinderGeometry args={[0.17, 0.17, 0.3, 64]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <Glow ref={flash} color="#e7dcff" scale={2.2} position-z={0.5} opacity={0.35} />
        <mesh position-z={0.01}>
          <torusGeometry args={[1.72, 0.06, 16, 120]} />
          <meshMatcapMaterial matcap={matcap.chrome()} />
        </mesh>

        {/* flecha: ponta em z=0, haste para trás (-z) */}
        <group ref={arrow}>
          <mesh position-z={-0.18} rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.1, 0.36, 32]} />
            <meshMatcapMaterial matcap={matcap.chrome()} />
          </mesh>
          <mesh position-z={-1.35} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.032, 0.032, 2.1, 20]} />
            <meshMatcapMaterial matcap={matcap.chrome()} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position-z={-2.2} rotation-z={(i * Math.PI * 2) / 3}>
              <boxGeometry args={[0.018, 0.26, 0.42]} />
              <meshMatcapMaterial matcap={matcap.lilac()} />
            </mesh>
          ))}
        </group>
      </group>
    </Bob>
  )
}

export default function TargetScene({ className }) {
  return (
    <Stage className={className} env={false} camera={{ position: [0, 0.4, 7.4], fov: 36 }}>
      <Glow color="#5b1fe0" scale={5.5} position={[0, 0, -3]} opacity={0.85} />
      <Target />
      <Dust count={28} size={[5, 4, 2]} />
    </Stage>
  )
}
