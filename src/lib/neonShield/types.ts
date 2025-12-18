export interface Point {
    x: number;
    y: number;
}

export interface Segment {
    p1: Point;
    p2: Point;
    length: number;
    id: string; // Unique ID for finding in adjacency
}

export interface Walker {
    id: number;
    currentSegment: Segment;
    progress: number; // 0 to length
    speed: number;
    reverse: boolean; // if true, moving p2 -> p1
    color: string;
    hue: number;
    dead: boolean;
}

export interface EngineConfig {
    svgUrl: string;
    snapGrid: number; // default 10
    walkerCount: number; // default 90
    zoomMin: number;
    zoomMax: number;
    baseZoom: number; // ~0.6-1.5 depending on view
    trailFadeAlpha: number; // 0.05-0.1
}

export interface ViewportState {
    x: number;
    y: number;
    zoom: number;
    width: number;
    height: number;
}
