# Epic Arcana Chapter Icons

This directory contains the icon system for Epic Arcana chapters.

## Structure

```
/public/icons/
├── chapters/           # Chapter-specific icons
│   ├── book1/          # Book 1 chapters (40 icons)
│   │   ├── chapter1.png
│   │   ├── chapter2.png
│   │   └── ...
│   ├── book2/          # Book 2 chapters (40 icons)
│   └── ...             # Books 3-9
└── fallback/           # Fallback icons
    ├── default-chapter.svg
    └── default-chapter.png
```

## Icon Specifications

- **Format**: PNG preferred, SVG for fallbacks
- **Size**: 32x32px minimum, 64x64px recommended
- **Background**: Transparent
- **Style**: Should complement the tarot/mystical theme

## Database Integration

Each chapter has an `icon_path` field in the database:
- Format: `chapters/book{N}/chapter{M}.png`
- Example: `chapters/book1/chapter15.png`
- Fallback: Uses `/icons/fallback/default-chapter.svg` if icon missing

## Usage

Icons are automatically loaded in the chapter display:
1. Checks database `icon_path` field first
2. Falls back to auto-generated path: `/icons/chapters/book{N}/chapter{M}.png`
3. If file doesn't exist, uses fallback icon

## Adding New Icons

1. Place PNG files in appropriate `/chapters/book{N}/` directory
2. Name them `chapter{M}.png` where M is the chapter number
3. Icons will be automatically picked up by the system

## Tarot Integration

Consider creating icons that reflect:
- Chapter's tarot card association (stored in `tarotFamily` and `tarotCardItem`)
- Color theme (stored in `colorTheme`)
- Story progression and hero's journey stages