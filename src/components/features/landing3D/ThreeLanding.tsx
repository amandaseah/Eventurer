import * as THREE from 'three'
import gsap from 'gsap'
import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useCursor, useGLTF, Html, useProgress } from '@react-three/drei'
import HomePreview from '../../pages/HomePreview'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type FocusKey = 'wide' | 'monitor'
type ZoomState = 'WIDE' | 'ZOOMING_IN' | 'ZOOMED' | 'ZOOMING_OUT'

const FOCUS: Record<FocusKey, { position: [number, number, number]; target: [number, number, number] }> = {
  wide: { position: [2.2, 1.35, 2.5], target: [0, 1.0, 0] },
  monitor: { position: [1.0, 1.15, 1.35], target: [0, 1.12, 0] },
}

const DWELL_DELAY_MS = 220
const TWEEN_DURATION = 1.1
const TWEEN_EASE = 'power3.inOut'
const DESK_YAW = THREE.MathUtils.degToRad(-42)

export function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  controls?: OrbitControlsImpl,
  offset = 1.15,
) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = THREE.MathUtils.degToRad(camera.fov)
  let distance = maxDim / (2 * Math.tan(fov / 2))
  distance *= offset

  const direction = new THREE.Vector3()
  if (controls) {
    direction.copy(camera.position).sub(controls.target).normalize()
  } else {
    camera.getWorldDirection(direction)
    direction.normalize().negate()
  }

  const newPosition = center.clone().add(direction.multiplyScalar(distance))
  camera.position.copy(newPosition)
  camera.lookAt(center)
  camera.updateProjectionMatrix()

  if (controls) {
    controls.target.copy(center)
    controls.update()
  }
}

function tweenFocus(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControlsImpl,
  focus: FocusKey,
  onComplete: () => void,
) {
  controls.enableRotate = true
  controls.enableZoom = true
  gsap.killTweensOf(camera.position)
  gsap.killTweensOf(controls.target)
  controls.enableRotate = false
  controls.enableZoom = false

  const next = FOCUS[focus]
  const update = () => controls.update()

  const targetTween = gsap.to(controls.target, {
    x: next.target[0],
    y: next.target[1],
    z: next.target[2],
    duration: TWEEN_DURATION,
    ease: TWEEN_EASE,
    onUpdate: update,
  })

  gsap.to(camera.position, {
    x: next.position[0],
    y: next.position[1],
    z: next.position[2],
    duration: TWEEN_DURATION,
    ease: TWEEN_EASE,
    onUpdate: update,
  })

  const finish = () => {
    controls.enableRotate = true
    controls.enableZoom = true
    update()
    onComplete()
  }

  targetTween.eventCallback('onComplete', finish)
  targetTween.eventCallback('onInterrupt', finish)
}

function DeskWithMonitor({
  onMonitorEnter,
  onMonitorLeave,
  onModelReady,
  htmlPointerEnabled,
  showInstruction,
  devMode,
  deskGroupRef,
}: {
  onMonitorEnter: () => void
  onMonitorLeave: () => void
  onModelReady: (object: THREE.Object3D) => void
  htmlPointerEnabled: boolean
  showInstruction: boolean
  devMode: boolean
  deskGroupRef: React.MutableRefObject<THREE.Group | null>
}) {
  const { scene } = useGLTF('/finaldeets.glb') as any
  const readyRef = useRef(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.geometry && !child.userData.__geometryPrepared) {
          child.geometry = child.geometry.clone()
          child.geometry.computeVertexNormals()
          child.userData.__geometryPrepared = true
        }
        child.castShadow = true
        child.receiveShadow = true
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        materials.forEach((material) => {
          if (!material) return
          material.polygonOffset = true
          material.polygonOffsetFactor = 2
          material.polygonOffsetUnits = 2
          if (material.side === undefined || material.side === THREE.DoubleSide) {
            material.side = THREE.FrontSide
          }
          material.depthWrite = true
          material.depthTest = true
          material.needsUpdate = true
          if ('shadowSide' in material) {
            material.shadowSide = THREE.FrontSide
          }
        })
      }
    })
  }, [scene])

  useEffect(() => {
    if (!readyRef.current) {
      const target = deskGroupRef.current ?? scene
      if (target) {
        readyRef.current = true
        onModelReady(target)
      }
    }
  }, [deskGroupRef, scene, onModelReady])

  const planeSize: [number, number] = [0.64, 0.38]
  const planePos: [number, number, number] = [0.02, 1.16, -0.048]
  const planeRot: [number, number, number] = [0, Math.PI, 0]
  const planeRot2: [number, number, number] = [0, 1.6, 0]
  return (
    <group
      ref={deskGroupRef}
      rotation={[0, DESK_YAW, 0]}
    >
      <primitive object={scene} />
      <mesh
        position={planePos}
        // rotation={planeRot as any}
        rotation={planeRot2 as any}
        // rotation={planeRot2 as any}
        // rotation={[number, number, number]}
        onPointerOver={(event) => {
          event.stopPropagation()
          onMonitorEnter()
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          onMonitorLeave()
        }}
      >
        <planeGeometry args={planeSize} />
        <meshBasicMaterial
          transparent
          opacity={devMode ? 0.15 : 0}
          color='#00ff00'
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
        <Html
          transform
          position={[0, 0, 0]}
          scale={[planeSize[0] / 700, planeSize[0] / 700, planeSize[0] / 700]}
          distanceFactor={1}
          style={{
            width: 700,
            height: 430,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 0 24px rgba(234, 129, 180, 0.22)',
            background: '#fff0f6',
            pointerEvents: htmlPointerEnabled ? 'auto' : 'none',
            transition: 'pointer-events 0.2s ease',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(145deg, rgba(255,240,246,0.96), rgba(255,228,238,0.92))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: htmlPointerEnabled ? 0 : 1,
                transition: 'opacity 280ms ease',
              }}
            >
              <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <HomePreview />
              </div>
            </div>
            <iframe
              title='Eventurer'
              src='/app'
              loading='eager'
              onLoad={() => setIframeLoaded(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#fff0f6',
                opacity: iframeLoaded && htmlPointerEnabled ? 1 : iframeLoaded ? 0 : 0,
                pointerEvents: htmlPointerEnabled ? 'auto' : 'none',
                transition: 'opacity 320ms ease',
              }}
            />
          </div>
        </Html>
        {showInstruction && (
          <Html
            position={[0.02, 0.6, -0.4]}
            // position={[0.28, 0.07, 0.02]}
            transform
            distanceFactor={1.4}
            style={{
              pointerEvents: 'none',
              fontFamily: '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 18,
              color: '#f5f5f5',
              textAlign: 'center',
              background: 'rgba(14,14,16,0.65)',
              letterSpacing: '0.05em',
              boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
              
            }}
          >
            hover over the screen to explore Eventurer ✨
          </Html>
        )}
      </mesh>
    </group>
  )
}

useGLTF.preload('/finaldeets.glb')

function ControlsUpdater({ controlsRef }: { controlsRef: React.MutableRefObject<OrbitControlsImpl | null> }) {
  useFrame(() => {
    controlsRef.current?.update()
  })
  return null
}

function CameraParallax({
  controlsRef,
  zoomStateRef,
  dwellTimerRef,
  mouseRef,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>
  zoomStateRef: React.MutableRefObject<ZoomState>
  dwellTimerRef: React.MutableRefObject<number | null>
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const parallaxRef = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    if (zoomStateRef.current !== 'WIDE') {
      return
    }

    const camera = controls.object as THREE.PerspectiveCamera
    const canParallax = dwellTimerRef.current === null
    const targetOffsetX = (canParallax ? mouseRef.current.x : 0) * 0.15
    const targetOffsetY = (canParallax ? mouseRef.current.y : 0) * 0.08

    const parallaxSmoothing = 4
    parallaxRef.current.x = THREE.MathUtils.damp(parallaxRef.current.x, targetOffsetX, parallaxSmoothing, delta)
    parallaxRef.current.y = THREE.MathUtils.damp(parallaxRef.current.y, targetOffsetY, parallaxSmoothing, delta)

    const offsetX = parallaxRef.current.x
    const offsetY = parallaxRef.current.y

    const cinematicFactor = 5

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      FOCUS.wide.position[0] + offsetX * 1.0,
      cinematicFactor,
      delta,
    )
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      FOCUS.wide.position[1] + offsetY * 0.4,
      cinematicFactor,
      delta,
    )
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      FOCUS.wide.position[2] - offsetX * 0.45,
      cinematicFactor,
      delta,
    )

    controls.target.x = THREE.MathUtils.damp(
      controls.target.x,
      FOCUS.wide.target[0] + offsetX * 0.6,
      cinematicFactor,
      delta,
    )
    controls.target.y = THREE.MathUtils.damp(
      controls.target.y,
      FOCUS.wide.target[1] + offsetY * 0.75,
      cinematicFactor,
      delta,
    )
    controls.target.z = THREE.MathUtils.damp(
      controls.target.z,
      FOCUS.wide.target[2] - offsetX * 0.3,
      cinematicFactor,
      delta,
    )

    controls.update()
  })

  return null
}

const LOADER_STYLE_ID = 'eventurer-loader-animations'
const loaderAnimationCss = `
@keyframes eventurerGlowDriftA {
  0% { transform: translate3d(-30%, -35%, 0) scale(1); opacity: 0.58; }
  50% { transform: translate3d(25%, -15%, 0) scale(1.25); opacity: 0.72; }
  100% { transform: translate3d(-20%, 30%, 0) scale(1.05); opacity: 0.6; }
}
@keyframes eventurerGlowDriftB {
  0% { transform: translate3d(35%, 20%, 0) scale(0.95); opacity: 0.45; }
  50% { transform: translate3d(-10%, -25%, 0) scale(1.4); opacity: 0.7; }
  100% { transform: translate3d(40%, -5%, 0) scale(1.1); opacity: 0.5; }
}
@keyframes eventurerLoaderPulse {
  0%, 100% { transform: translateY(0); opacity: 0.65; }
  50% { transform: translateY(-6px); opacity: 1; }
}
`

function GlobalLoader({ opacity }: { opacity: number }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(LOADER_STYLE_ID)) return
    const styleTag = document.createElement('style')
    styleTag.id = LOADER_STYLE_ID
    styleTag.textContent = loaderAnimationCss
    document.head.appendChild(styleTag)
  }, [])

  const { progress } = useProgress()
  const rounded = Math.min(100, Math.max(0, Math.round(progress)))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 228, 240, 0.92), rgba(255, 200, 220, 0.9))',
        color: '#5b3142',
        pointerEvents: 'auto',
        opacity,
        transition: 'opacity 260ms ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '65vmax',
          height: '65vmax',
          top: '50%',
          left: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.82) 0%, rgba(255,176,204,0.16) 45%, rgba(255,191,214,0) 70%)',
          filter: 'blur(0px)',
          mixBlendMode: 'screen',
          animation: 'eventurerGlowDriftA 8.5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '55vmax',
          height: '55vmax',
          top: '35%',
          right: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,245,250,0.78) 0%, rgba(253,203,220,0.18) 40%, rgba(255,200,224,0) 72%)',
          filter: 'blur(0px)',
          mixBlendMode: 'screen',
          animation: 'eventurerGlowDriftB 10s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            opacity: 0.88,
            animation: 'eventurerLoaderPulse 2.6s ease-in-out infinite',
          }}
        >
          Loading Eventurer
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.32em',
            opacity: 0.65,
          }}
        >
          {`${rounded}%`}
        </span>
      </div>
    </div>
  )
}

export default function ThreeLanding() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const deskGroupRef = useRef<THREE.Group | null>(null)
  const dwellTimerRef = useRef<number | null>(null)
  const zoomStateRef = useRef<ZoomState>('WIDE')
  const mouse = useRef({ x: 0, y: 0 })
  const [devMode] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [currentZoomState, setCurrentZoomState] = useState<ZoomState>('WIDE')
  const [canvasDpr, setCanvasDpr] = useState<[number, number]>([1, 1.6])
  const [showLoader, setShowLoader] = useState(true)
  const [loaderOpacity, setLoaderOpacity] = useState(1)
  useCursor(isHovering)

  const isZoomed = currentZoomState === 'ZOOMED'
  const handleDeskReady = useCallback(
    (object: THREE.Object3D) => {
      modelRef.current = deskGroupRef.current ?? object
      setModelReady(true)
    },
    [],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const deviceCap = Math.min(window.devicePixelRatio || 1, 1.6)
    setCanvasDpr([1, deviceCap])
  }, [])

  useEffect(() => {
    if (modelReady) {
      setLoaderOpacity(0)
      const timeout = window.setTimeout(() => setShowLoader(false), 280)
      return () => window.clearTimeout(timeout)
    }
    setShowLoader(true)
    setLoaderOpacity(1)
  }, [modelReady])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    if (overlayOpen) {
      controls.enableRotate = false
      controls.enableZoom = false
    } else if (zoomStateRef.current === 'WIDE') {
      controls.enableRotate = true
      controls.enableZoom = true
    }
  }, [overlayOpen])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!modelReady) return
    const controls = controlsRef.current
    const model = modelRef.current
    if (!controls || !model) return

    const camera = controls.object as THREE.PerspectiveCamera
    fitCameraToObject(camera, model, controls, 1.15)
    camera.position.set(...FOCUS.wide.position)
    controls.target.set(...FOCUS.wide.target)
    controls.update()
    zoomStateRef.current = 'WIDE'
    setCurrentZoomState('WIDE')
  }, [modelReady])

  const clearDwell = useCallback(() => {
    if (dwellTimerRef.current !== null) {
      window.clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }
  }, [])

  const runTransition = useCallback(
    (focus: FocusKey, startState: ZoomState, endState: ZoomState, postComplete?: () => void) => {
      const controls = controlsRef.current
      if (!controls) return
      const camera = controls.object as THREE.PerspectiveCamera

      zoomStateRef.current = startState
      setCurrentZoomState(startState)

      tweenFocus(camera, controls, focus, () => {
        zoomStateRef.current = endState
        setCurrentZoomState(endState)
        if (endState === 'ZOOMED') {
          setOverlayOpen(true)
        }
        if (endState === 'WIDE') {
          setOverlayOpen(false)
        }
        postComplete?.()
      })
    },
    [],
  )

  const handleMonitorEnter = useCallback(() => {
    setIsHovering(true)
    if (zoomStateRef.current !== 'WIDE' || dwellTimerRef.current !== null) return

    dwellTimerRef.current = window.setTimeout(() => {
      dwellTimerRef.current = null
      if (zoomStateRef.current !== 'WIDE') return
      runTransition('monitor', 'ZOOMING_IN', 'ZOOMED')
    }, DWELL_DELAY_MS)
  }, [runTransition])

  const handleMonitorLeave = useCallback(() => {
    setIsHovering(false)
    if (overlayOpen) {
      clearDwell()
      return
    }
    const state = zoomStateRef.current
    clearDwell()

    if (state === 'ZOOMING_IN' || state === 'ZOOMED') {
      runTransition('wide', 'ZOOMING_OUT', 'WIDE')
    }
  }, [clearDwell, overlayOpen, runTransition])

  useEffect(() => {
    return () => {
      clearDwell()
    }
  }, [clearDwell])

  const closeOverlay = useCallback(() => {
    if (!overlayOpen) return
    setOverlayOpen(false)
    if (zoomStateRef.current !== 'WIDE') {
      runTransition('wide', 'ZOOMING_OUT', 'WIDE')
    }
  }, [overlayOpen, runTransition])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeOverlay])

  return (
    <>
      <Canvas
        dpr={canvasDpr}
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          depth: true,
          stencil: false,
          logarithmicDepthBuffer: false,
        }}
        performance={{ min: 0.6, debounce: 200 }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#0e0e10', 1)
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.85
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          if ('useLegacyLights' in gl) {
            // ensure physically based lighting pipeline for stable shading
            ;(gl as any).useLegacyLights = false
          }
          if ('physicallyCorrectLights' in gl) {
            ;(gl as any).physicallyCorrectLights = true
          }
          camera.near = 0.25
          camera.far = 30
          camera.updateProjectionMatrix()
        }}
        camera={{ fov: 45, near: 0.25, far: 30, position: FOCUS.wide.position }}
        style={{
          width: '100vw',
          height: '100vh',
          background: '#0e0e10',
          opacity: modelReady ? 1 : 0,
          transition: 'opacity 320ms ease',
        }}
      >
        <Suspense fallback={null}>
          <color attach='background' args={['#0e0e10']} />
          <ambientLight intensity={0.35} color='#ffe8d2' />
          <directionalLight
            position={[4, 6, 2]}
            intensity={0.55}
            color='#f4c89d'
            castShadow
            shadow-bias={-0.0008}
            shadow-normalBias={0.04}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Environment preset='studio' environmentIntensity={0.7} />
          <DeskWithMonitor
            devMode={devMode}
            htmlPointerEnabled={isZoomed}
            showInstruction={!overlayOpen && currentZoomState === 'WIDE'}
            deskGroupRef={deskGroupRef}
            onMonitorEnter={handleMonitorEnter}
            onMonitorLeave={handleMonitorLeave}
            onModelReady={handleDeskReady}
          />
          <ContactShadows position={[0, -0.001, 0]} opacity={0.35} scale={10} blur={2} frames={1} />
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.1}
            minDistance={1.5}
            maxDistance={4}
            minPolarAngle={0.8}
            maxPolarAngle={1.35}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            enableZoom
            enablePan={false}
            zoomSpeed={0.6}
            target={FOCUS.wide.target}
          />
          <ControlsUpdater controlsRef={controlsRef} />
          <CameraParallax
            controlsRef={controlsRef}
            zoomStateRef={zoomStateRef}
            dwellTimerRef={dwellTimerRef}
            mouseRef={mouse}
          />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          display: 'flex',
          opacity: overlayOpen ? 1 : 0,
          pointerEvents: overlayOpen ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(14,14,16,0.9)',
        }}
      >
        <button
          type='button'
          onClick={closeOverlay}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            padding: '0.6rem 1.2rem',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(10,10,12,0.8)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            cursor: 'pointer',
          }}
        >
          Exit
        </button>
        <div
          style={{
            width: 'min(90vw, 1200px)',
            height: 'min(85vh, 720px)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(0,0,0,0.45)',
            background: '#000',
          }}
        >
          <iframe title='Eventurer Monitor' src='/app' style={{ width: '100%', height: '100%', border: 'none' }} />
        </div>
      </div>
      {showLoader && <GlobalLoader opacity={loaderOpacity} />}
    </>
  )
}
