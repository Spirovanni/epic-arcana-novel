import { EngineConfig, Point, Segment, ViewportState, Walker } from './types'

export class NeonEngine {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    // Offscreen buffers
    private baseCanvas: OffscreenCanvas | HTMLCanvasElement
    private trailCanvas: OffscreenCanvas | HTMLCanvasElement

    private config: EngineConfig
    private viewport: ViewportState
    private isRunning: boolean = false
    private rafId: number = 0

    // Graph Data
    private segments: Segment[] = []
    private adjacency: Map<string, Segment[]> = new Map() // key: x,y string
    private polygons: { points: Point[], color: string }[] = []
    private bbox: { minX: number, minY: number, maxX: number, maxY: number } = { minX: 0, minY: 0, maxX: 0, maxY: 0 }

    // Simulation
    private walkers: Walker[] = []

    // Debug
    private loadError: string | null = null
    private debugInfo = { tiles: 0, segs: 0, verts: 0 }

    constructor(canvas: HTMLCanvasElement, config: Partial<EngineConfig> = {}) {
        this.canvas = canvas
        const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
        if (!ctx) throw new Error('Could not get 2d context')
        this.ctx = ctx as CanvasRenderingContext2D

        this.config = {
            svgUrl: config.svgUrl || '/images/svg_files/BaseShieldTri.svg',
            snapGrid: config.snapGrid || 10,
            walkerCount: config.walkerCount || 90,
            zoomMin: 0.6,
            zoomMax: 7,
            baseZoom: 1.0,
            trailFadeAlpha: 0.08,
        }

        this.viewport = {
            x: 0,
            y: 0,
            zoom: 1,
            width: canvas.width,
            height: canvas.height
        }

        // Init buffers
        if (typeof OffscreenCanvas !== 'undefined') {
            this.baseCanvas = new OffscreenCanvas(100, 100)
            this.trailCanvas = new OffscreenCanvas(100, 100)
        } else {
            this.baseCanvas = document.createElement('canvas')
            this.trailCanvas = document.createElement('canvas')
        }
    }

    public async init() {
        try {
            await this.loadAndParseSVG()
            this.fitCamera()
            this.initWalkers()
            this.renderBaseLayer()
            this.start()
        } catch (e: any) {
            this.loadError = e.message
            this.drawDebugOverlay()
        }
    }

    public resize(width: number, height: number, dpr: number) {
        this.canvas.width = width * dpr
        this.canvas.height = height * dpr
        // Fix pure scaling by scaling the context? 
        // Usually better to just keep logical size and draw larger.
        // For this engine, viewport.width/height is logical pixels.
        this.viewport.width = width
        this.viewport.height = height
        // If dpr changed, we might need to re-render base? 
        // We treat baseCanvas as WORLD SPACE cache. SVG size.
    }

    public pan(dx: number, dy: number) {
        this.viewport.x -= dx / this.viewport.zoom
        this.viewport.y -= dy / this.viewport.zoom
    }

    public zoom(delta: number, centerX: number, centerY: number) {
        const oldZoom = this.viewport.zoom
        // Standard scroll zoom: newZoom = oldZoom * (1 - delta * 0.001) or similar
        // Clamp
        let newZoom = oldZoom * Math.pow(0.999, delta)
        newZoom = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, newZoom))

        // Zoom towards point logic
        // worldX = (screenX - offset) / oldZoom
        // newOffset = screenX - worldX * newZoom

        // BUT our viewport.x/y is "center of screen in world coords" or "top left"?
        // Let's implement viewport as standard translation: Screen = (World + ViewportXY) * Zoom?
        // Actually easier: Screen = (World - CamPos) * Zoom + ScreenCenter
        // Let's stick to: Translate(-CamX, -CamY) -> Scale(Zoom) -> Translate(ScreenW/2, ScreenH/2)

        // We need to map screen point to world point before zoom
        // P_world = (P_screen - Center) / OldZoom + Cam

        const worldPointX = (centerX - this.viewport.width / 2) / oldZoom + this.viewport.x
        const worldPointY = (centerY - this.viewport.height / 2) / oldZoom + this.viewport.y

        this.viewport.zoom = newZoom

        // Now adjust cam so worldPoint is still at centerX
        // Cam = worldPoint - (P_screen - Center) / NewZoom

        this.viewport.x = worldPointX - (centerX - this.viewport.width / 2) / newZoom
        this.viewport.y = worldPointY - (centerY - this.viewport.height / 2) / newZoom
    }

    public reseed() {
        // Clear trails
        const tCtx = this.trailCanvas.getContext('2d') as CanvasRenderingContext2D | null
        if (tCtx) tCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height)

        this.initWalkers()
    }

    private fitCamera() {
        const w = this.bbox.maxX - this.bbox.minX
        const h = this.bbox.maxY - this.bbox.minY
        const cx = (this.bbox.minX + this.bbox.maxX) / 2
        const cy = (this.bbox.minY + this.bbox.maxY) / 2

        this.viewport.x = cx
        this.viewport.y = cy

        // Initial zoom to fit loosely
        const scaleX = this.viewport.width / (w * 1.2)
        const scaleY = this.viewport.height / (h * 1.2)
        this.viewport.zoom = Math.min(scaleX, scaleY)
    }

    private async loadAndParseSVG() {
        const res = await fetch(this.config.svgUrl)
        if (!res.ok) throw new Error('Failed to fetch SVG')
        const text = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'image/svg+xml')
        const svgErr = doc.querySelector('parsererror')
        if (svgErr) throw new Error('Invalid SVG content')

        // Parse CSS styles
        const styleRules = new Map<string, string>()
        doc.querySelectorAll('style').forEach(style => {
            const css = style.textContent || ''
            // Minimal CSS parser
            const blocks = css.split('}')
            for (const block of blocks) {
                const [selectorPart, body] = block.split('{')
                if (selectorPart && body) {
                    const selector = selectorPart.trim().replace('.', '') // assume class selector .cls-5
                    const fillMatch = body.match(/fill:\s*([^;]+)/)
                    if (fillMatch) {
                        styleRules.set(selector, fillMatch[1].trim())
                    }
                }
            }
        })

        const polys: { points: Point[], color: string }[] = []

        const elements = [...Array.from(doc.querySelectorAll('polygon')), ...Array.from(doc.querySelectorAll('polyline'))]

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

        elements.forEach(el => {
            const pointsAttr = el.getAttribute('points')
            if (!pointsAttr) return

            const nums = pointsAttr.trim().split(/[\s,]+/).map(Number)
            const pts: Point[] = []
            for (let i = 0; i < nums.length; i += 2) {
                const x = nums[i]
                const y = nums[i + 1]
                if (!isNaN(x) && !isNaN(y)) {
                    // Bounds
                    if (x < minX) minX = x
                    if (x > maxX) maxX = x
                    if (y < minY) minY = y
                    if (y > maxY) maxY = y

                    pts.push({ x, y })
                }
            }

            // Color resolution
            let color = '#444'
            const attrFill = el.getAttribute('fill')
            if (attrFill && attrFill !== 'none') {
                color = attrFill
            } else {
                const cls = el.getAttribute('class')
                if (cls) {
                    // handle multiple classes? just split spaces
                    const classes = cls.split(' ')
                    for (const c of classes) {
                        if (styleRules.has(c)) {
                            color = styleRules.get(c)!
                        }
                    }
                }
            }

            if (pts.length > 2) {
                polys.push({ points: pts, color })
            }
        })

        this.polygons = polys
        this.bbox = { minX, minY, maxX, maxY }

        if (polys.length === 0) throw new Error('No polygons found in SVG')

        this.buildGraph()
    }

    private buildGraph() {
        const snap = (v: number) => Math.round(v / this.config.snapGrid) * this.config.snapGrid
        const vertexMap = new Map<string, Point>()
        const getVertex = (x: number, y: number) => {
            const sx = snap(x)
            const sy = snap(y)
            const key = `${sx},${sy}`
            if (!vertexMap.has(key)) {
                vertexMap.set(key, { x: sx, y: sy })
            }
            return { pt: vertexMap.get(key)!, key }
        }

        const segments: Segment[] = []
        const adj = new Map<string, Segment[]>()

        const addSegment = (pA: Point, keyA: string, pB: Point, keyB: string) => {
            if (keyA === keyB) return // degenerate

            // dedupe: check if segment exists between A and B
            // We can just rely on geometry or store a set of ordered keys?
            // simpler: allow dupes (double lanes) or filter unique? 
            // For visual "neon", dupes overlap.
            // Let's filter unique based on sorted keys
            const edgeId = keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`

            // Actually, we iterate input polygons. If two polygons share an edge, we might want ONE segment or TWO?
            // If we want "walkers" to traverse the mesh, shared edges are bidirectional.
            // Let's just create segments for every polygon edge.
            // BUT better for walkers: Unique segments.
            // If polygons share an edge, we only want one "road".

            const existing = segments.find(s => s.id === edgeId)
            if (!existing) {
                const len = Math.hypot(pB.x - pA.x, pB.y - pA.y)
                const seg: Segment = { p1: pA, p2: pB, length: len, id: edgeId }
                segments.push(seg)

                // Adj
                if (!adj.has(keyA)) adj.set(keyA, [])
                if (!adj.has(keyB)) adj.set(keyB, [])
                adj.get(keyA)!.push(seg)
                adj.get(keyB)!.push(seg)
            }
        }

        this.polygons.forEach(poly => {
            const pts = poly.points
            for (let i = 0; i < pts.length; i++) {
                const curr = pts[i]
                const next = pts[(i + 1) % pts.length]
                const v1 = getVertex(curr.x, curr.y)
                const v2 = getVertex(next.x, next.y)
                addSegment(v1.pt, v1.key, v2.pt, v2.key)
            }
        })

        this.segments = segments
        this.adjacency = adj
        this.debugInfo = {
            tiles: this.polygons.length,
            segs: segments.length,
            verts: vertexMap.size
        }

        // Resize offscreen buffers to SVG bbox
        const w = this.bbox.maxX - this.bbox.minX + 100 // padding
        const h = this.bbox.maxY - this.bbox.minY + 100
        this.baseCanvas.width = w
        this.baseCanvas.height = h
        this.trailCanvas.width = w
        this.trailCanvas.height = h
    }

    private renderBaseLayer() {
        // Render polygons to baseCanvas
        const ctx = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D
        if (!ctx) return

        // Clear
        ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height)

        // Transform to local coords?
        // baseCanvas 0,0 corresponds to bbox.minX - 50, bbox.minY - 50
        const offsetX = this.bbox.minX - 50
        const offsetY = this.bbox.minY - 50

        ctx.save()
        ctx.translate(-offsetX, -offsetY)

        this.polygons.forEach(poly => {
            ctx.beginPath()
            if (poly.points.length > 0) {
                ctx.moveTo(poly.points[0].x, poly.points[0].y)
                for (let i = 1; i < poly.points.length; i++) {
                    ctx.lineTo(poly.points[i].x, poly.points[i].y)
                }
                ctx.closePath()
            }
            ctx.fillStyle = poly.color
            ctx.fill()

            // Edge definition
            ctx.lineWidth = 1
            ctx.strokeStyle = 'rgba(0,0,0,0.3)'
            ctx.stroke()
        })

        ctx.restore()
    }

    private initWalkers() {
        if (this.segments.length === 0) return
        const walkers: Walker[] = []

        for (let i = 0; i < this.config.walkerCount; i++) {
            const seg = this.segments[Math.floor(Math.random() * this.segments.length)]
            const hue = Math.random() * 360
            walkers.push({
                id: i,
                currentSegment: seg,
                progress: Math.random() * seg.length,
                speed: (1 + Math.random()) * 2, // px per frame
                reverse: Math.random() > 0.5,
                color: `hsl(${hue}, 100%, 70%)`,
                hue,
                dead: false
            })
        }
        this.walkers = walkers
    }

    public start() {
        if (this.isRunning) return
        this.isRunning = true
        this.loop()
    }

    public stop() {
        this.isRunning = false
        cancelAnimationFrame(this.rafId)
    }

    public destroy() {
        this.stop()
        // Cleanup if any
    }

    private loop = () => {
        if (!this.isRunning) return

        this.updateWalkers()
        this.drawTrails()
        this.renderMain()

        this.rafId = requestAnimationFrame(this.loop)
    }

    private updateWalkers() {
        const snap = (v: number) => Math.round(v / this.config.snapGrid) * this.config.snapGrid
        const getKey = (p: Point) => `${snap(p.x)},${snap(p.y)}`

        this.walkers.forEach(w => {
            w.progress += w.speed
            if (w.progress >= w.currentSegment.length) {
                // Reached end
                const overshoot = w.progress - w.currentSegment.length

                // Current "end" point depends on direction
                const endPt = w.reverse ? w.currentSegment.p1 : w.currentSegment.p2
                const endKey = getKey(endPt)

                // Adjacency
                const candidates = this.adjacency.get(endKey) || []
                // Filter out current segment to avoid u-turn if possible
                const others = candidates.filter(s => s.id !== w.currentSegment.id)

                const nextSeg = others.length > 0
                    ? others[Math.floor(Math.random() * others.length)]
                    : w.currentSegment // U-turn

                w.currentSegment = nextSeg
                w.progress = overshoot

                // Determine new direction
                // If nextSeg is connected to endPt, we need to know which end of nextSeg is endPt
                const k1 = getKey(nextSeg.p1)
                // const k2 = getKey(nextSeg.p2)

                // If p1 is the connection, we traverse p1 -> p2 (normal)
                if (k1 === endKey) {
                    w.reverse = false
                } else {
                    w.reverse = true
                }
                // Slight Hue oscillate
                w.hue = (w.hue + 1) % 360
                w.color = `hsl(${w.hue}, 100%, 60%)`
            }
        })
    }

    private drawTrails() {
        const ctx = this.trailCanvas.getContext('2d') as CanvasRenderingContext2D
        if (!ctx) return

        // Fade buffer
        ctx.fillStyle = `rgba(0,0,0,${this.config.trailFadeAlpha})`
        ctx.fillRect(0, 0, this.trailCanvas.width, this.trailCanvas.height)

        const offsetX = this.bbox.minX - 50
        const offsetY = this.bbox.minY - 50

        ctx.save()
        ctx.translate(-offsetX, -offsetY)

        // Additive blending for neon glow
        ctx.globalCompositeOperation = 'lighter'

        this.walkers.forEach(w => {
            // Interp pos
            const t = w.progress / w.currentSegment.length
            // if reverse: p2 -> p1
            const x = w.reverse
                ? w.currentSegment.p2.x + (w.currentSegment.p1.x - w.currentSegment.p2.x) * t
                : w.currentSegment.p1.x + (w.currentSegment.p2.x - w.currentSegment.p1.x) * t

            const y = w.reverse
                ? w.currentSegment.p2.y + (w.currentSegment.p1.y - w.currentSegment.p2.y) * t
                : w.currentSegment.p1.y + (w.currentSegment.p2.y - w.currentSegment.p1.y) * t

            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2) // small dot
            ctx.fillStyle = w.color
            ctx.fill()
        })

        ctx.restore()
    }

    private renderMain() {
        // Composition
        const { width, height } = this.canvas
        this.ctx.fillStyle = '#050505'
        this.ctx.fillRect(0, 0, width, height)

        if (this.loadError) return // debug overlay handles it in init/resize?

        // Transform
        const cx = width / 2
        const cy = height / 2

        const offsetX = this.bbox.minX - 50
        const offsetY = this.bbox.minY - 50

        // Matrix: translate(cx, cy) scale(z) translate(-viewX, -viewY) 
        // And we need to account for the offscreen canvas offset

        // World draw point (0,0) is at screen: 
        // sx = (0 - viewX) * z + cx

        // Draw Base
        // Base texture coords: 0,0 is world (minX-50, minY-50)
        // So to draw it at world (minX-50, minY-50), we transform

        const worldOriginScreenX = (-this.viewport.x) * this.viewport.zoom + cx
        const worldOriginScreenY = (-this.viewport.y) * this.viewport.zoom + cy

        const baseDestX = worldOriginScreenX + (offsetX * this.viewport.zoom)
        const baseDestY = worldOriginScreenY + (offsetY * this.viewport.zoom)
        const baseDestW = this.baseCanvas.width * this.viewport.zoom
        const baseDestH = this.baseCanvas.height * this.viewport.zoom

        // We can just use transforms on context
        this.ctx.save()
        this.ctx.translate(worldOriginScreenX, worldOriginScreenY)
        this.ctx.scale(this.viewport.zoom, this.viewport.zoom)

        // Now we are in World Space (aligned with 0,0)
        // Base canvas is offset by offsetX, offsetY
        // Draw Base
        this.ctx.drawImage(this.baseCanvas, offsetX, offsetY)

        // Draw Trails (screen - lighter)
        this.ctx.globalCompositeOperation = 'lighter' // or 'screen'
        this.ctx.drawImage(this.trailCanvas, offsetX, offsetY)

        this.ctx.restore()

        // Debug overlay
        /*
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(`Zoom: ${this.viewport.zoom.toFixed(2)}`, 10, 20)
        this.ctx.fillText(`Tiles: ${this.debugInfo.tiles}`, 10, 35)
        */
    }

    private drawDebugOverlay() {
        if (this.loadError) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.fillStyle = 'red'
            this.ctx.font = '16px monospace'
            this.ctx.fillText(`Error: ${this.loadError}`, 20, 50)
        }
    }
}
