'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn, getContrastingTextColor, getDarkerShade, getLighterShade, getThemeAwareBackgroundColor } from '@/lib/utils';
import { X, Calendar, Bookmark, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import type { HfCalendarResult } from '@/lib/hfCalendar';

interface DayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  day: HfCalendarResult | null;
}

export function DayDrawer({ isOpen, onClose, day }: DayDrawerProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  if (!day) return null;

  const getSegmentDisplay = () => {
    switch (day.segment) {
      case 'Q1': return 'Q1 • Genesis';
      case 'Q2': return 'Q2 • Growth';
      case 'MID_A': return 'Exile • Emptying';
      case 'MIDPOINT': return 'Axis Mundi';
      case 'MID_B': return 'Renewal • Return';
      case 'Q3': return 'Q3 • Harvest';
      case 'Q4': return 'Q4 • Integration';
      default: return day.segment;
    }
  };

  const getDetoxDisplay = () => {
    switch (day.detoxPhase) {
      case 'EXILE_1_20': return `Exile Day ${day.intraSegmentIndex}/20`;
      case 'MIDPOINT': return 'Sacred Pause';
      case 'RENEWAL_1_20': return `Renewal Day ${day.intraSegmentIndex}/20`;
      default: return null;
    }
  };

  const getDayTypeDescription = () => {
    if (day.isMidpoint) {
      return "The Axis Mundi represents the sacred center, a point of deep reflection and connection to the divine. This is a day for stillness, meditation, and accessing the wisdom that lies at the heart of existence.";
    }
    
    if (day.isRestDay) {
      return "Rest days are threshold moments for integration and ritual. These sacred pauses allow you to process the experiences of the preceding 80 days and prepare for the next phase of your journey.";
    }
    
    if (day.detoxPhase === 'EXILE_1_20') {
      return "The Exile phase is a time of deconstructive emptying, like a journey into the wilderness. This period helps you release what no longer serves and make space for new growth.";
    }
    
    if (day.detoxPhase === 'RENEWAL_1_20') {
      return "The Renewal phase is a time of reconstructive return, rebuilding yourself with new wisdom and clarity. This period helps you integrate your wilderness experience and emerge transformed.";
    }
    
    return "Active days follow the 20-day Mayan cadence, each carrying the energy of a specific day sign. These days are for engagement, learning, and working with the sacred patterns of time.";
  };

  const handleCopyToJournal = async () => {
    const journalEntry = `
# ${new Date(day.dateISO).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

**${getSegmentDisplay()}** - Day ${day.dayOfYear365}/365

${day.daySignName ? `**Day Sign:** ${day.daySignName}` : ''}
${day.archetype ? `**Archetype:** ${day.archetype}` : ''}
${day.theme ? `**Theme:** ${day.theme}` : ''}

## Reflection
${day.reflection || day.overrideDescription || getDayTypeDescription()}

## Today's Ritual
${day.ritual || day.overrideRitual || 'Take time for mindful presence and intention setting.'}

${day.keywords ? `**Keywords:** ${day.keywords}` : ''}
`.trim();

    try {
      await navigator.clipboard.writeText(journalEntry);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Enhanced color styling with proper contrast and theme awareness
  const getColorStyles = () => {
    if (!day.color) {
      return {
        backgroundStyle: undefined,
        textColor: undefined, // Let CSS variables handle this
        accentColor: 'hsl(var(--primary))',
        cardClasses: ''
      };
    }

    const mainColor = day.color;
    // Use CSS custom properties for text color to ensure proper inheritance
    const textColor = isDarkMode ? '#f1f5f9' : '#1e293b'; 
    const themeAwareBg = getThemeAwareBackgroundColor(mainColor, isDarkMode, 0.12);
    const borderOpacity = isDarkMode ? 0.5 : 0.4;
    
    return {
      backgroundStyle: {
        background: themeAwareBg,
        borderColor: `${mainColor}${Math.round(borderOpacity * 255).toString(16).padStart(2, '0')}`,
        color: textColor
      },
      textColor: textColor,
      accentColor: mainColor,
      darkerAccent: isDarkMode ? getLighterShade(mainColor, 0.2) : getDarkerShade(mainColor, 0.1),
      cardClasses: 'border-2'
    };
  };

  const colorStyles = getColorStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle 
            className="flex items-center gap-2 text-foreground"
            style={colorStyles.textColor ? { color: colorStyles.textColor } : {}}
          >
            <Calendar 
              className="h-5 w-5" 
              style={{ color: colorStyles.accentColor }}
            />
            {new Date(day.dateISO).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DialogTitle>
          <DialogDescription 
            className="text-muted-foreground"
            style={{ 
              color: colorStyles.textColor ? `${colorStyles.textColor}cc` : undefined 
            }}
          >
            {getSegmentDisplay()} • Day {day.dayOfYear365}/365
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Day Info Card */}
          <Card 
            className={cn("relative overflow-hidden bg-card text-card-foreground", colorStyles.cardClasses)} 
            style={colorStyles.backgroundStyle}
          >
            <CardHeader className="text-center pb-3">
              {/* Day Sign or Special Day */}
              {day.isActiveDay && day.daySignName ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    {day.glyph && (
                      <span className="text-3xl">{day.glyph}</span>
                    )}
                    <div>
                      <CardTitle 
                        className="text-xl text-foreground"
                        style={colorStyles.textColor ? { color: colorStyles.textColor } : {}}
                      >
                        {day.daySignName}
                      </CardTitle>
                      <CardDescription 
                        className="text-sm text-muted-foreground"
                        style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                      >
                        Day Sign {day.twentyDayWeekIndex + 1}/20
                      </CardDescription>
                    </div>
                  </div>
                  {day.archetype && (
                    <p 
                      className="text-base font-medium text-primary"
                      style={day.color ? { color: colorStyles.accentColor } : {}}
                    >
                      {day.archetype}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <CardTitle 
                    className="text-xl text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    {day.isMidpoint ? 'Axis Mundi' : 
                     day.isRestDay ? 'Rest Day' :
                     getDetoxDisplay() || 'Sacred Day'}
                  </CardTitle>
                  <CardDescription 
                    className="text-sm text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                  >
                    {day.isMidpoint ? 'Sacred Center Point' :
                     day.isRestDay ? 'Threshold Ritual' :
                     'Detox Phase'}
                  </CardDescription>
                  {/* Detox Phase Display */}
                  {getDetoxDisplay() && !day.isMidpoint && (
                    <div 
                      className="text-sm font-semibold text-primary"
                      style={day.color ? { color: colorStyles.accentColor } : {}}
                    >
                      {getDetoxDisplay()}
                    </div>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {/* Day Type Description */}
              <div 
                className="rounded-lg p-3 bg-muted/50 text-card-foreground"
                style={day.color ? { 
                  backgroundColor: getThemeAwareBackgroundColor(day.color, isDarkMode, 0.08),
                  color: colorStyles.textColor 
                } : {}}
              >
                <p className="text-sm leading-relaxed">
                  {getDayTypeDescription()}
                </p>
              </div>

              {/* Combined Content Section */}
              <div className="space-y-2">
                {/* Theme and Reflection combined */}
                {day.theme && (
                  <div>
                    <h3 
                      className="font-semibold text-sm text-foreground mb-1"
                      style={day.color ? { color: colorStyles.textColor } : {}}
                    >
                      Today's Theme
                    </h3>
                    <p 
                      className="text-sm text-muted-foreground"
                      style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                    >
                      {day.theme}
                    </p>
                  </div>
                )}

                {(day.reflection || day.overrideDescription) && (
                  <div>
                    <h3 
                      className="font-semibold text-sm text-foreground mb-1"
                      style={day.color ? { color: colorStyles.textColor } : {}}
                    >
                      Reflection
                    </h3>
                    <p 
                      className="text-sm leading-relaxed text-muted-foreground"
                      style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                    >
                      {day.reflection || day.overrideDescription}
                    </p>
                  </div>
                )}

                {day.overrideTitle && (
                  <div>
                    <h3 
                      className="font-semibold text-sm text-foreground mb-1"
                      style={day.color ? { color: colorStyles.textColor } : {}}
                    >
                      Special Focus
                    </h3>
                    <p 
                      className="text-sm text-muted-foreground"
                      style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                    >
                      {day.overrideTitle}
                    </p>
                  </div>
                )}

                {(day.ritual || day.overrideRitual) && (
                  <div>
                    <h3 
                      className="font-semibold text-sm text-foreground mb-1"
                      style={day.color ? { color: colorStyles.textColor } : {}}
                    >
                      Today's Ritual
                    </h3>
                    <p 
                      className="text-sm leading-relaxed text-muted-foreground"
                      style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                    >
                      {day.overrideRitual || day.ritual}
                    </p>
                  </div>
                )}

                {/* Keywords and Tags combined */}
                {(day.keywords || day.overrideTags) && (
                  <div>
                    <h3 
                      className="font-semibold text-sm text-foreground mb-2"
                      style={day.color ? { color: colorStyles.textColor } : {}}
                    >
                      {day.keywords ? 'Keywords' : 'Tags'}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {day.keywords && day.keywords.split(',').map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                          style={day.color ? { 
                            backgroundColor: getThemeAwareBackgroundColor(day.color, isDarkMode, 0.2),
                            color: colorStyles.textColor
                          } : {}}
                        >
                          {keyword.trim()}
                        </span>
                      ))}
                      {day.overrideTags && day.overrideTags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          style={day.color ? { 
                            backgroundColor: `${colorStyles.accentColor}30`,
                            color: colorStyles.accentColor
                          } : {}}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToJournal}
              disabled={copied}
              className="flex items-center gap-1 text-xs px-3 py-1.5 h-8"
              style={day.color ? {
                borderColor: colorStyles.accentColor,
                color: colorStyles.accentColor,
                backgroundColor: copied 
                  ? `${colorStyles.accentColor}15`
                  : 'transparent'
              } : {}}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-1 text-xs px-3 py-1.5 h-8"
              style={day.color ? {
                backgroundColor: colorStyles.accentColor,
                color: getContrastingTextColor(colorStyles.accentColor, isDarkMode),
                borderColor: colorStyles.accentColor
              } : {}}
            >
              <Bookmark className="h-3 w-3" />
              Favorite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}