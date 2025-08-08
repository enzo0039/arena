import { Float, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import {
  Color,
  DoubleSide,
  MathUtils,
  MeshPhysicalMaterial,
} from 'three'

function Raf({ render = true }) {
  const { advance } = useThree()

  useEffect(() => {
    let rafId
    const loop = (time) => {
      if (render) {
        advance(time / 1000)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [render, advance])
  
  return null
}

function BackgroundShader() {
  const { viewport } = useThree()
  const material = useRef()
  
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new Float32Array([window.innerWidth, window.innerHeight]) },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.u_time.value = clock.elapsedTime
    }
  })

  useEffect(() => {
    const handleResize = () => {
      if (material.current) {
        material.current.uniforms.u_resolution.value.set(
          window.innerWidth,
          window.innerHeight
        )
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <mesh position={[0, 0, -100]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={`
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          uniform vec2 u_resolution;
          
          void main() {
            vec2 st = gl_FragCoord.xy / u_resolution;
            float alpha = 0.0;
            gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
          }
        `}
        uniforms={uniforms}
        side={DoubleSide}
        transparent={true}
      />
    </mesh>
  )
}

const material = new MeshPhysicalMaterial({
  color: new Color('#C0C0C0'), // Couleur chrome argentée
  metalness: 1, // Maximum pour l'aspect métallique
  roughness: 0.1, // Très faible pour un aspect brillant/miroir
  wireframe: false, // Désactiver le wireframe pour un rendu plein
  side: DoubleSide,
  clearcoat: 1.0, // Couche de vernis pour plus de brillance
  clearcoatRoughness: 0.05, // Vernis très lisse
})

export function Logo() {
  const { scene: arm1 } = useGLTF('/models/logo_futur.glb')
  const parent = useRef()
  const { viewport } = useThree()
  
  useEffect(() => {
    if (arm1) {
      arm1.traverse((node) => {
        if (node.material) node.material = material
      })
    }
  }, [arm1])

  useFrame(() => {
    if (parent.current) {
      // Animation légère du logo
      parent.current.rotation.y += 0.001
    }
  })

  return (
    <>
      <ambientLight args={[new Color('#404040')]} />
      <directionalLight position={[-200, 150, 50]} args={[new Color('#ffffff'), 0.8]} />
      <directionalLight position={[300, -100, 150]} args={[new Color('#ffffff'), 0.6]} />
      
      <Float floatIntensity={1} rotationIntensity={1}>
        <group
          ref={parent}
          position={[0, 0, 0]}
          scale={viewport.height * 0.15}
          rotation={[0, MathUtils.degToRad(30), 0]}
        >
          <primitive object={arm1} scale={[1, 1, 1]} />
        </group>
      </Float>
    </>
  )
}

function Content() {
  return (
    <>
      <BackgroundShader />
      <Logo />
    </>
  )
}

export function MobileHeroWebGL({ render = true }) {
  return (
    <Canvas
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 1.5]} // Résolution réduite pour les performances sur mobile
      frameloop="never"
      orthographic
      camera={{ near: 0.01, far: 10000, position: [0, 0, 1000] }}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <Raf render={render} />
      <Suspense>
        <Content />
      </Suspense>
    </Canvas>
  )
}
