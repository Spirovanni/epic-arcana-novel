"use client";

import React from 'react';

interface GridOverlayProps {
  zoom: number;
  center: { x: number; y: number };
  isVisible: boolean;
  timelineColor: string;
  width: number;
  height: number;
}

export function GridOverlay({ 
  zoom, 
  center, 
  isVisible, 
  timelineColor, 
  width, 
  height 
}: GridOverlayProps) {
  if (!isVisible) return null;

  // SVG coordinate system: viewBox="0 0 3306.216 3200.83"
  // Set the coordinate system origin to match the map's existing (0,0) point
  const svgWidth = 3306.216;
  const svgHeight = 3200.83;
  
  // Based on the screenshot, the map's (0,0) point appears to be located at approximately:
  // The map's (0,0) coordinate (bottom red circle) is in the lower ocean area
  // From visual analysis of the screenshot positioning:
  const mapOriginX = 1400; // Slightly left of center based on screenshot
  const mapOriginY = 2300; // In the lower portion where the (0,0) marker appears
  
  // Calculate appropriate grid spacing based on zoom level
  let baseGridSize = 200; // Base grid spacing in coordinate units
  
  // Adjust grid size based on zoom to prevent overcrowding
  if (zoom > 2) baseGridSize = 100;
  if (zoom > 4) baseGridSize = 50;
  if (zoom < 0.5) baseGridSize = 400;
  
  // Calculate the visible area in map coordinates
  const halfWidth = width / (2 * zoom);
  const halfHeight = height / (2 * zoom);
  
  // Convert from screen center offset to map coordinates
  const mapLeft = mapOriginX - center.x / zoom - halfWidth;
  const mapTop = mapOriginY - center.y / zoom - halfHeight;
  const mapRight = mapOriginX - center.x / zoom + halfWidth;
  const mapBottom = mapOriginY - center.y / zoom + halfHeight;
  
  // Calculate grid start positions aligned to the grid, centered on map origin
  const startX = Math.floor((mapLeft - mapOriginX) / baseGridSize) * baseGridSize;
  const startY = Math.floor((mapTop - mapOriginY) / baseGridSize) * baseGridSize;
  const endX = Math.ceil((mapRight - mapOriginX) / baseGridSize) * baseGridSize;
  const endY = Math.ceil((mapBottom - mapOriginY) / baseGridSize) * baseGridSize;
  
  // Generate grid lines
  const verticalLines = [];
  const horizontalLines = [];
  const labels = [];
  
  // Vertical grid lines and X-axis labels
  for (let x = startX; x <= endX; x += baseGridSize) {
    const mapX = mapOriginX + x; // Convert grid coordinate to map coordinate
    
    verticalLines.push(
      <line
        key={`v-${x}`}
        x1={mapX}
        y1={mapTop - baseGridSize}
        x2={mapX}
        y2={mapBottom + baseGridSize}
        stroke={timelineColor}
        strokeWidth={1 / zoom}
        opacity={0.4}
        strokeDasharray={`${3 / zoom},${3 / zoom}`}
      />
    );
    
    // Add X coordinate labels
    labels.push(
      <text
        key={`x-label-${x}`}
        x={mapX}
        y={mapTop + 15 / zoom}
        fontSize={Math.max(10 / zoom, 8)}
        fill={timelineColor}
        textAnchor="middle"
        dominantBaseline="hanging"
        opacity={0.9}
        fontWeight="500"
      >
        {x}
      </text>
    );
  }
  
  // Horizontal grid lines and Y-axis labels
  for (let y = startY; y <= endY; y += baseGridSize) {
    const mapY = mapOriginY + y; // Convert grid coordinate to map coordinate
    
    horizontalLines.push(
      <line
        key={`h-${y}`}
        x1={mapLeft - baseGridSize}
        y1={mapY}
        x2={mapRight + baseGridSize}
        y2={mapY}
        stroke={timelineColor}
        strokeWidth={1 / zoom}
        opacity={0.4}
        strokeDasharray={`${3 / zoom},${3 / zoom}`}
      />
    );
    
    // Add Y coordinate labels
    labels.push(
      <text
        key={`y-label-${y}`}
        x={mapLeft + 15 / zoom}
        y={mapY}
        fontSize={Math.max(10 / zoom, 8)}
        fill={timelineColor}
        textAnchor="start"
        dominantBaseline="middle"
        opacity={0.9}
        fontWeight="500"
      >
        {-y}
      </text>
    );
  }

  // Add center point marker (0,0)
  const centerMarker = (
    <g key="center-marker" opacity={0.8}>
      <circle
        cx={mapOriginX}
        cy={mapOriginY}
        r={4 / zoom}
        fill={timelineColor}
        stroke="white"
        strokeWidth={1 / zoom}
      />
      <text
        x={mapOriginX + 8 / zoom}
        y={mapOriginY - 8 / zoom}
        fontSize={Math.max(12 / zoom, 9)}
        fill={timelineColor}
        textAnchor="start"
        dominantBaseline="baseline"
        fontWeight="600"
      >
        (0,0)
      </text>
    </g>
  );

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <svg
        width={width}
        height={height}
        style={{
          transform: `translate(${center.x}px, ${center.y}px) scale(${zoom})`,
          transformOrigin: 'center'
        }}
        viewBox={`${mapLeft} ${mapTop} ${mapRight - mapLeft} ${mapBottom - mapTop}`}
      >
        {/* Grid lines */}
        <g>
          {verticalLines}
          {horizontalLines}
        </g>
        
        {/* Coordinate labels */}
        <g>
          {labels}
        </g>
        
        {/* Center point marker */}
        {centerMarker}
      </svg>
    </div>
  );
}