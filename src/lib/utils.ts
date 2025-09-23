export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Color utility functions for calendar day popup
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function getContrastingTextColor(backgroundColor: string, isDarkMode?: boolean): string {
  // Handle different color formats
  let rgb: { r: number; g: number; b: number } | null = null;
  
  if (backgroundColor.startsWith('#')) {
    rgb = hexToRgb(backgroundColor);
  } else if (backgroundColor.startsWith('hsl')) {
    // Basic HSL parsing for simple cases
    const matches = backgroundColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (matches) {
      const h = parseInt(matches[1]) / 360;
      const s = parseInt(matches[2]) / 100;
      const l = parseInt(matches[3]) / 100;
      
      // Convert HSL to RGB
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h * 6) % 2 - 1));
      const m = l - c / 2;
      
      let r = 0, g = 0, b = 0;
      if (h >= 0 && h < 1/6) {
        r = c; g = x; b = 0;
      } else if (h >= 1/6 && h < 2/6) {
        r = x; g = c; b = 0;
      } else if (h >= 2/6 && h < 3/6) {
        r = 0; g = c; b = x;
      } else if (h >= 3/6 && h < 4/6) {
        r = 0; g = x; b = c;
      } else if (h >= 4/6 && h < 5/6) {
        r = x; g = 0; b = c;
      } else {
        r = c; g = 0; b = x;
      }
      
      rgb = {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    }
  }
  
  if (!rgb) {
    // Fallback based on theme mode
    return isDarkMode ? '#e5e5e5' : '#1a1a1a';
  }
  
  // Calculate luminance
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  
  // More conservative approach for better contrast
  // For dark mode, prefer lighter text; for light mode, prefer darker text
  if (isDarkMode) {
    return luminance > 0.3 ? '#1a1a1a' : '#f5f5f5';
  } else {
    return luminance > 0.6 ? '#1a1a1a' : '#ffffff';
  }
}

// Add theme-aware background color function
export function getThemeAwareBackgroundColor(baseColor: string, isDarkMode: boolean, opacity: number = 0.1): string {
  if (!baseColor) {
    return isDarkMode ? `rgba(255, 255, 255, ${opacity * 0.5})` : `rgba(0, 0, 0, ${opacity})`;
  }
  
  const rgb = hexToRgb(baseColor);
  if (!rgb) {
    return isDarkMode ? `rgba(255, 255, 255, ${opacity * 0.5})` : `rgba(0, 0, 0, ${opacity})`;
  }
  
  // In dark mode, use lighter variations of the color
  // In light mode, use the color as-is but with low opacity
  if (isDarkMode) {
    const lighterRgb = {
      r: Math.min(255, rgb.r + 80),
      g: Math.min(255, rgb.g + 80),
      b: Math.min(255, rgb.b + 80)
    };
    return `rgba(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}, ${opacity})`;
  } else {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }
}

export function getDarkerShade(color: string, amount: number = 0.3): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const darkerRgb = {
    r: Math.max(0, Math.round(rgb.r * (1 - amount))),
    g: Math.max(0, Math.round(rgb.g * (1 - amount))),
    b: Math.max(0, Math.round(rgb.b * (1 - amount)))
  };
  
  return `rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b})`;
}

export function getLighterShade(color: string, amount: number = 0.3): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const lighterRgb = {
    r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount)),
    g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount)),
    b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount))
  };
  
  return `rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b})`;
}