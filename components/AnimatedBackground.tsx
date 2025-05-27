"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function AnimatedBackground() {
  const points = useRef<THREE.Points>(null)

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      const distance = Math.sqrt(Math.random()) * 1.5
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)

      const x = distance * Math.sin(theta) * Math.cos(phi)
      const y = distance * Math.sin(theta) * Math.sin(phi)
      const z = distance * Math.cos(theta)

      positions.set([x, y, z], i * 3)
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x -= delta / 10
      points.current.rotation.y -= delta / 15
    }
  })

  return (
    <points ref={points} rotation={[0, 0, Math.PI / 4]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.002} color="#fff" sizeAttenuation={true} transparent={true} opacity={0.6} />
    </points>
  )
}
