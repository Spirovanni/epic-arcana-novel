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
        textColor: isDarkMode ? '#f1f5f9' : '#1e293b', // slate-100 / slate-800
        accentColor: isDarkMode ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
        cardClasses: ''
      };
    }

    const mainColor = day.color;
    // Use better contrast with the new muted background
    const textColor = isDarkMode ? '#f1f5f9' : '#1e293b'; // Force good contrast with slate backgrounds
    const themeAwareBg = getThemeAwareBackgroundColor(mainColor, isDarkMode, 0.12);
    const borderOpacity = isDarkMode ? 0.5 : 0.4; // Slightly more visible borders
    
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
            style={{ color: day.color ? colorStyles.textColor : undefined }}
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
              color: day.color ? `${colorStyles.textColor}cc` : undefined 
            }}
          >
            {getSegmentDisplay()} • Day {day.dayOfYear365}/365
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Day Info Card */}
          <Card 
            className={cn("relative overflow-hidden", colorStyles.cardClasses)} 
            style={colorStyles.backgroundStyle}
          >
            <CardHeader className="text-center">
              {/* Day Sign or Special Day */}
              {day.isActiveDay && day.daySignName ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    {day.glyph && (
                      <span className="text-4xl">{day.glyph}</span>
                    )}
                    <div>
                      <CardTitle 
                        className="text-2xl text-foreground"
                        style={day.color ? { color: colorStyles.textColor } : {}}
                      >
                        {day.daySignName}
                      </CardTitle>
                      <CardDescription 
                        className="text-base text-muted-foreground"
                        style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                      >
                        Day Sign {day.twentyDayWeekIndex + 1}/20
                      </CardDescription>
                    </div>
                  </div>
                  {day.archetype && (
                    <p 
                      className="text-lg font-medium text-primary"
                      style={day.color ? { color: colorStyles.accentColor } : {}}
                    >
                      {day.archetype}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <CardTitle 
                    className="text-2xl text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    {day.isMidpoint ? 'Axis Mundi' : 
                     day.isRestDay ? 'Rest Day' :
                     getDetoxDisplay() || 'Sacred Day'}
                  </CardTitle>
                  <CardDescription 
                    className="text-base text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                  >
                    {day.isMidpoint ? 'Sacred Center Point' :
                     day.isRestDay ? 'Threshold Ritual' :
                     'Detox Phase'}
                  </CardDescription>
                </div>
              )}

              {/* Detox Phase Display */}
              {getDetoxDisplay() && !day.isMidpoint && (
                <div 
                  className="text-lg font-semibold text-primary"
                  style={day.color ? { color: colorStyles.accentColor } : {}}
                >
                  {getDetoxDisplay()}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Day Type Description */}
              <div 
                className="rounded-lg p-4 bg-muted/50"
                style={day.color ? { 
                  backgroundColor: getThemeAwareBackgroundColor(day.color, isDarkMode, 0.08),
                  color: colorStyles.textColor 
                } : {}}
              >
                <p className="text-sm leading-relaxed">
                  {getDayTypeDescription()}
                </p>
              </div>

              {/* Theme */}
              {day.theme && (
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    Today's Theme
                  </h3>
                  <p 
                    className="text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                  >
                    {day.theme}
                  </p>
                </div>
              )}

              {/* Reflection */}
              {(day.reflection || day.overrideDescription) && (
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    Reflection
                  </h3>
                  <p 
                    className="leading-relaxed text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                  >
                    {day.reflection || day.overrideDescription}
                  </p>
                </div>
              )}

              {/* Special Title for Overrides */}
              {day.overrideTitle && (
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    Special Focus
                  </h3>
                  <p 
                    className="text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                  >
                    {day.overrideTitle}
                  </p>
                </div>
              )}

              {/* Ritual */}
              {(day.ritual || day.overrideRitual) && (
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    Today's Ritual
                  </h3>
                  <p 
                    className="leading-relaxed text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor, opacity: 0.8 } : {}}
                  >
                    {day.overrideRitual || day.ritual}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {day.keywords && (
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {day.keywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground"
                        style={day.color ? { 
                          backgroundColor: getThemeAwareBackgroundColor(day.color, isDarkMode, 0.2),
                          color: colorStyles.textColor
                        } : {}}
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags for overrides */}
              {day.overrideTags && (
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {day.overrideTags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
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
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card 
            className={cn("border bg-muted/50", day.color ? colorStyles.cardClasses : "")}
            style={day.color ? {
              backgroundColor: getThemeAwareBackgroundColor(day.color, isDarkMode, 0.05),
              borderColor: `${colorStyles.accentColor}40`
            } : {}}
          >
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span 
                    className="font-medium text-foreground"
                    style={day.color ? { color: colorStyles.accentColor } : {}}
                  >
                    Segment:
                  </span>{' '}
                  <span 
                    className="text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    {day.segment}
                  </span>
                </div>
                <div>
                  <span 
                    className="font-medium text-foreground"
                    style={day.color ? { color: colorStyles.accentColor } : {}}
                  >
                    Segment Day:
                  </span>{' '}
                  <span 
                    className="text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    {day.intraSegmentIndex}
                  </span>
                </div>
                {day.isActiveDay && (
                  <>
                    <div>
                      <span 
                        className="font-medium text-foreground"
                        style={day.color ? { color: colorStyles.accentColor } : {}}
                      >
                        20-Day Cycle:
                      </span>{' '}
                      <span 
                        className="text-muted-foreground"
                        style={day.color ? { color: colorStyles.textColor } : {}}
                      >
                        {day.twentyDayWeekIndex + 1}/20
                      </span>
                    </div>
                    <div>
                      <span 
                        className="font-medium text-foreground"
                        style={day.color ? { color: colorStyles.accentColor } : {}}
                      >
                        Day Sign Index:
                      </span>{' '}
                      <span 
                        className="text-muted-foreground"
                        style={day.color ? { color: colorStyles.textColor } : {}}
                      >
                        {day.twentyDayWeekIndex}
                      </span>
                    </div>
                  </>
                )}
                <div>
                  <span 
                    className="font-medium text-foreground"
                    style={day.color ? { color: colorStyles.accentColor } : {}}
                  >
                    Day Type:
                  </span>{' '}
                  <span 
                    className="text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    {day.isMidpoint ? 'Midpoint' :
                     day.isRestDay ? 'Rest Day' :
                     day.isActiveDay ? 'Active Day' : 'Special Day'}
                  </span>
                </div>
                <div>
                  <span 
                    className="font-medium text-foreground"
                    style={day.color ? { color: colorStyles.accentColor } : {}}
                  >
                    Detox Phase:
                  </span>{' '}
                  <span 
                    className="text-muted-foreground"
                    style={day.color ? { color: colorStyles.textColor } : {}}
                  >
                    {day.detoxPhase.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToJournal}
              disabled={copied}
              className="flex items-center gap-2 transition-colors duration-200"
              style={day.color ? {
                borderColor: colorStyles.accentColor,
                color: colorStyles.accentColor,
                backgroundColor: copied 
                  ? `${colorStyles.accentColor}15`
                  : 'transparent'
              } : {}}
              onMouseEnter={(e) => {
                if (colorStyles.accentColor && !copied && day.color) {
                  e.currentTarget.style.backgroundColor = `${colorStyles.accentColor}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (colorStyles.accentColor && !copied && day.color) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to Journal
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 transition-colors duration-200"
              style={day.color ? {
                backgroundColor: colorStyles.accentColor,
                color: getContrastingTextColor(colorStyles.accentColor, isDarkMode),
                borderColor: colorStyles.accentColor
              } : {}}
              onMouseEnter={(e) => {
                if (colorStyles.accentColor && day.color) {
                  e.currentTarget.style.backgroundColor = colorStyles.darkerAccent;
                }
              }}
              onMouseLeave={(e) => {
                if (colorStyles.accentColor && day.color) {
                  e.currentTarget.style.backgroundColor = colorStyles.accentColor;
                }
              }}
            >
              <Bookmark className="h-4 w-4" />
              Add to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}