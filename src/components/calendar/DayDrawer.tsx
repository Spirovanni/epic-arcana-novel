'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X, Calendar, Bookmark, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { HfCalendarResult } from '@/lib/hfCalendar';

interface DayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  day: HfCalendarResult | null;
}

export function DayDrawer({ isOpen, onClose, day }: DayDrawerProps) {
  const [copied, setCopied] = useState(false);

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

  const backgroundStyle = day.color ? {
    background: `linear-gradient(135deg, ${day.color}10, ${day.color}20)`
  } : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {new Date(day.dateISO).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DialogTitle>
          <DialogDescription>
            {getSegmentDisplay()} • Day {day.dayOfYear365}/365
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Day Info Card */}
          <Card className="relative overflow-hidden" style={backgroundStyle}>
            <CardHeader className="text-center">
              {/* Day Sign or Special Day */}
              {day.isActiveDay && day.daySignName ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    {day.glyph && (
                      <span className="text-4xl">{day.glyph}</span>
                    )}
                    <div>
                      <CardTitle className="text-2xl">
                        {day.daySignName}
                      </CardTitle>
                      <CardDescription className="text-base">
                        Day Sign {day.twentyDayWeekIndex + 1}/20
                      </CardDescription>
                    </div>
                  </div>
                  {day.archetype && (
                    <p className="text-lg font-medium text-primary">
                      {day.archetype}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <CardTitle className="text-2xl">
                    {day.isMidpoint ? 'Axis Mundi' : 
                     day.isRestDay ? 'Rest Day' :
                     getDetoxDisplay() || 'Sacred Day'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {day.isMidpoint ? 'Sacred Center Point' :
                     day.isRestDay ? 'Threshold Ritual' :
                     'Detox Phase'}
                  </CardDescription>
                </div>
              )}

              {/* Detox Phase Display */}
              {getDetoxDisplay() && !day.isMidpoint && (
                <div className="text-lg font-semibold text-primary">
                  {getDetoxDisplay()}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Day Type Description */}
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">
                  {getDayTypeDescription()}
                </p>
              </div>

              {/* Theme */}
              {day.theme && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Today's Theme</h3>
                  <p className="text-muted-foreground">
                    {day.theme}
                  </p>
                </div>
              )}

              {/* Reflection */}
              {(day.reflection || day.overrideDescription) && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Reflection</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {day.reflection || day.overrideDescription}
                  </p>
                </div>
              )}

              {/* Special Title for Overrides */}
              {day.overrideTitle && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Special Focus</h3>
                  <p className="text-muted-foreground">
                    {day.overrideTitle}
                  </p>
                </div>
              )}

              {/* Ritual */}
              {(day.ritual || day.overrideRitual) && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Today's Ritual</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {day.overrideRitual || day.ritual}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {day.keywords && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {day.keywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
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
                  <h3 className="font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {day.overrideTags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
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
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Segment:</span> {day.segment}
                </div>
                <div>
                  <span className="font-medium">Segment Day:</span> {day.intraSegmentIndex}
                </div>
                {day.isActiveDay && (
                  <>
                    <div>
                      <span className="font-medium">20-Day Cycle:</span> {day.twentyDayWeekIndex + 1}/20
                    </div>
                    <div>
                      <span className="font-medium">Day Sign Index:</span> {day.twentyDayWeekIndex}
                    </div>
                  </>
                )}
                <div>
                  <span className="font-medium">Day Type:</span>{' '}
                  {day.isMidpoint ? 'Midpoint' :
                   day.isRestDay ? 'Rest Day' :
                   day.isActiveDay ? 'Active Day' : 'Special Day'}
                </div>
                <div>
                  <span className="font-medium">Detox Phase:</span> {day.detoxPhase.replace('_', ' ')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToJournal}
              disabled={copied}
              className="flex items-center gap-2"
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
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
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