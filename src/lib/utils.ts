import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color utility functions for theme-aware styling

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function getLighterShade(hex: string, factor: number = 0.2): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));
  
  return rgbToHex(r, g, b);
}

export function getDarkerShade(hex: string, factor: number = 0.2): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.max(0, Math.round(rgb.r * (1 - factor)));
  const g = Math.max(0, Math.round(rgb.g * (1 - factor)));
  const b = Math.max(0, Math.round(rgb.b * (1 - factor)));
  
  return rgbToHex(r, g, b);
}

export function getContrastingTextColor(bgColor: string, isDarkMode: boolean = false): string {
  const rgb = hexToRgb(bgColor);
  if (!rgb) return isDarkMode ? '#ffffff' : '#000000';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return high contrast color
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function getThemeAwareBackgroundColor(
  color: string, 
  isDarkMode: boolean, 
  opacity: number = 0.1
): string {
  const rgb = hexToRgb(color);
  if (!rgb) return isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  // In dark mode, use lighter colors with opacity
  // In light mode, use the original color with opacity
  if (isDarkMode) {
    const lighterRgb = {
      r: Math.min(255, rgb.r + 60),
      g: Math.min(255, rgb.g + 60),
      b: Math.min(255, rgb.b + 60)
    };
    return `rgba(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}, ${opacity})`;
  } else {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }
}
