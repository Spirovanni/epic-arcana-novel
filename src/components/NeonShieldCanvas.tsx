'use client'

import React, { useEffect, useRef } from 'react'
import { NeonEngine } from '@/lib/neonShield/engine'

export function NeonShieldCanvas() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<NeonEngine | null>(null)

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return

        const engine = new NeonEngine(canvasRef.current, {
            // url defaults to base shield
            zoomMin: 0.6,
            zoomMax: 7,
            walkerCount: 90
        })
        engineRef.current = engine

        // Init with proper size
        const { width, height } = containerRef.current.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        engine.resize(width, height, dpr)
        engine.init()

        // Resize observer
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === containerRef.current) {
                    const { width, height } = entry.contentRect
                    engine.resize(width, height, window.devicePixelRatio || 1)
                }
            }
        })
        ro.observe(containerRef.current)

        return () => {
            engine.destroy()
            ro.disconnect()
        }
    }, [])

    // Interaction handlers
    const handleWheel = (e: React.WheelEvent) => {
        if (engineRef.current) {
            // Prevent browser zoom if possible? 
            // Usually good to prevent default if it's a full screen canvas app
            // e.preventDefault() // React SyntheticEvent might be too late for non-passive?
            // Actually standard wheel zooms page. 
        }
    }

    // We attach native listeners for non-passive prevention if needed, 
    // but for now let's use React handlers and see if it feels okay.
    // Actually, wheel zooming usually needs `e.preventDefault()` to stop page scroll.
    // We should use a ref callback or useEffect to attach non-passive listener.

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (engineRef.current) {
                engineRef.current.zoom(e.deltaY, e.clientX, e.clientY)
            }
        }

        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [])

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.button === 0) { // Left click
            // Start Drag
            ; (e.target as Element).setPointerCapture(e.pointerId)
            lastPos.current = { x: e.clientX, y: e.clientY }
            isDragging.current = true
        }
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging.current && engineRef.current) {
            const dx = e.clientX - lastPos.current.x
            const dy = e.clientY - lastPos.current.y
            engineRef.current.pan(dx, dy)
            lastPos.current = { x: e.clientX, y: e.clientY }
        }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false
        // If it was a quick click, reseed?
        // Let's distinguish drag vs click logic if needed. 
        // For now: pure click is cleared if almost no motion? 
        // Or explicit button?
        // Prompt says: "Click: clear trails and reseed walkers"
        // So click = reseed. Drag = pan.
        // If movement < threshold?
    }

    const handleClick = () => {
        // Only trigger if not dragged significantly?
        // Simplified: Reseed on click. If you drag, you reseed at end? 
        // Let's keep a drag threshold
    }

    // Ref tracking for drag
    const isDragging = useRef(false)
    const lastPos = useRef({ x: 0, y: 0 })
    const startPos = useRef({ x: 0, y: 0 })

    const onDown = (e: React.PointerEvent) => {
        isDragging.current = true
        lastPos.current = { x: e.clientX, y: e.clientY }
        startPos.current = { x: e.clientX, y: e.clientY }
            ; (e.target as Element).setPointerCapture(e.pointerId)
    }

    const onMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        if (engineRef.current) {
            engineRef.current.pan(dx, dy)
        }
        lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const onUp = (e: React.PointerEvent) => {
        isDragging.current = false
        const dist = Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y)
        if (dist < 5 && engineRef.current) {
            // Was a click
            engineRef.current.reseed()
        }
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-black overflow-hidden relative"
        >
            <canvas
                ref={canvasRef}
                className="block touch-none"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                style={{ width: '100%', height: '100%' }}
            />

            {/* Overlay Instructions if needed */}
            <div className="absolute top-4 left-4 text-white/50 text-xs pointers-events-none select-none">
                <p>Drag to Pan • Wheel to Zoom • Click to Reseed</p>
            </div>
        </div>
    )
}
