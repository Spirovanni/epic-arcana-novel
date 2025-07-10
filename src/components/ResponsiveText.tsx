'use client';

import { useEffect, useRef, useState } from 'react';

interface ResponsiveTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  maxFontSize?: number;
  minFontSize?: number;
}

export default function ResponsiveText({ 
  text, 
  className = '', 
  style = {}, 
  maxFontSize = 32,
  minFontSize = 12
}: ResponsiveTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const element = textRef.current;
    if (!element || !element.parentElement) return;

    // Get the container dimensions
    const container = element.parentElement;
    const containerWidth = container.clientWidth - 16; // Account for padding
    const containerHeight = container.clientHeight - 8; // Account for padding

    // Start with max font size and work down
    let currentFontSize = maxFontSize;
    element.style.fontSize = `${currentFontSize}px`;

    // Keep reducing font size until text fits
    while (currentFontSize > minFontSize) {
      if (element.scrollWidth <= containerWidth && element.scrollHeight <= containerHeight) {
        break;
      }
      currentFontSize -= 1;
      element.style.fontSize = `${currentFontSize}px`;
    }

    setFontSize(currentFontSize);
  }, [text, maxFontSize, minFontSize]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: fontSize <= 16 ? '1.2' : '1.1',
        wordBreak: 'break-word',
        hyphens: 'auto',
        overflow: 'hidden',
        ...style
      }}
      title={text}
    >
      {text}
    </div>
  );
}