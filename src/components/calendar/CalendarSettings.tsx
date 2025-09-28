'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';
import { AlertCircle, Calendar, Palette, Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CalendarSettingsProps {
  className?: string;
}

interface SettingsData {
  anchor?: string;
  leapPolicy?: 'duplicate' | 'skip' | 'insert_after_Q4';
  theme?: string;
  showDayNumbers?: boolean;
  showColorLegend?: boolean;
  compactView?: boolean;
}

const LEAP_POLICY_OPTIONS = [
  { value: 'duplicate', label: 'Duplicate Day 365', description: 'Add an extra day 365 in leap years' },
  { value: 'skip', label: 'Skip Leap Day', description: 'Ignore Feb 29 and keep 365-day structure' },
  { value: 'insert_after_Q4', label: 'Insert After Q4', description: 'Add leap day after Q4 completion' }
];

const THEME_OPTIONS = [
  { value: 'default', label: 'Default Colors', description: 'Epic Arcana chapter colors' },
  { value: 'rainbow', label: 'Rainbow Spectrum', description: 'Traditional HSL rainbow progression' },
  { value: 'seasons', label: 'Seasonal Colors', description: 'Earth tones following seasons' },
  { value: 'monochrome', label: 'Monochrome', description: 'Grayscale with intensity variations' }
];

export function CalendarSettings({ className }: CalendarSettingsProps) {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSettings({
              anchor: data.data.anchor || '',
              leapPolicy: data.data.leapPolicy || 'skip',
              theme: data.data.theme || 'default',
              showDayNumbers: data.data.showDayNumbers !== 'false',
              showColorLegend: data.data.showColorLegend !== 'false',
              compactView: data.data.compactView === 'true'
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load settings:', err);
        // Use defaults
        setSettings({
          anchor: '',
          leapPolicy: 'skip',
          theme: 'default',
          showDayNumbers: true,
          showColorLegend: true,
          compactView: false
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setError(null);
    setSuccess(null);
  };

  const validateAnchorDate = (dateStr: string): boolean => {
    if (!dateStr) return true; // Empty is valid (use default)
    try {
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && Boolean(dateStr.match(/^\d{4}-\d{2}-\d{2}$/));
    } catch {
      return false;
    }
  };

  const saveSettings = async () => {
    if (!hasChanges) return;

    // Validate anchor date
    if (settings.anchor && !validateAnchorDate(settings.anchor)) {
      setError('Invalid anchor date format. Please use YYYY-MM-DD format.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        anchor: settings.anchor || undefined,
        leapPolicy: settings.leapPolicy,
        theme: settings.theme,
        showDayNumbers: settings.showDayNumbers?.toString(),
        showColorLegend: settings.showColorLegend?.toString(),
        compactView: settings.compactView?.toString()
      };

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Settings saved successfully');
        setHasChanges(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Network error while saving settings');
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      anchor: '',
      leapPolicy: 'skip',
      theme: 'default',
      showDayNumbers: true,
      showColorLegend: true,
      compactView: false
    });
    setHasChanges(true);
    setError(null);
    setSuccess(null);
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getDefaultAnchor = () => `${getCurrentYear()}-01-01`;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Calendar Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Messages */}
        {(error || success) && (
          <div className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              Display
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <SettingsIcon className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4 mt-4">
            {/* Year Anchor */}
            <div className="space-y-2">
              <Label htmlFor="anchor">Year Anchor Date</Label>
              <DatePicker
                date={settings.anchor ? new Date(settings.anchor) : undefined}
                onDateChange={(date) => {
                  const dateStr = date ? date.toISOString().split('T')[0] : '';
                  handleSettingChange('anchor', dateStr);
                }}
                placeholder={`Select anchor date (default: ${getDefaultAnchor()})`}
              />
              <p className="text-xs text-muted-foreground">
                Starting date for the 365-day calendar. Leave empty to use January 1st of current year.
              </p>
            </div>

            {/* Leap Year Policy */}
            <div className="space-y-2">
              <Label htmlFor="leapPolicy">Leap Year Policy</Label>
              <Select 
                value={settings.leapPolicy || 'skip'} 
                onValueChange={(value) => handleSettingChange('leapPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leap year handling" />
                </SelectTrigger>
                <SelectContent>
                  {LEAP_POLICY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4 mt-4">
            {/* Theme Selection */}
            <div className="space-y-2">
              <Label htmlFor="theme">Color Theme</Label>
              <Select 
                value={settings.theme || 'default'} 
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Display Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Display Options</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showDayNumbers">Show Day Numbers</Label>
                  <p className="text-xs text-muted-foreground">Display day numbers on hover/focus</p>
                </div>
                <Switch
                  id="showDayNumbers"
                  checked={settings.showDayNumbers ?? true}
                  onCheckedChange={(checked) => handleSettingChange('showDayNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showColorLegend">Show Color Legend</Label>
                  <p className="text-xs text-muted-foreground">Display legend explaining day types</p>
                </div>
                <Switch
                  id="showColorLegend"
                  checked={settings.showColorLegend ?? true}
                  onCheckedChange={(checked) => handleSettingChange('showColorLegend', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView">Compact View</Label>
                  <p className="text-xs text-muted-foreground">Reduce spacing for smaller screens</p>
                </div>
                <Switch
                  id="compactView"
                  checked={settings.compactView ?? false}
                  onCheckedChange={(checked) => handleSettingChange('compactView', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Settings</h4>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• <strong>Calendar Structure:</strong> 365-day Mayan-inspired sacred calendar</p>
                <p>• <strong>Quarters:</strong> Q1, Q2, Q3, Q4 (81 days each = 80 active + 1 rest)</p>
                <p>• <strong>Mid-Band:</strong> 40-day detox cycle + 1 midpoint (41 days total)</p>
                <p>• <strong>Day Signs:</strong> 20-day cycles advance only on active days</p>
                <p>• <strong>Epic Arcana:</strong> 365 days = 9 books × ~40.5 chapters each</p>
              </div>

              <Separator />

              <div>
                <h5 className="font-medium mb-2">Current Configuration</h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Anchor: {settings.anchor || `${getCurrentYear()}-01-01 (default)`}</p>
                  <p>Leap Policy: {LEAP_POLICY_OPTIONS.find(o => o.value === settings.leapPolicy)?.label}</p>
                  <p>Theme: {THEME_OPTIONS.find(o => o.value === settings.theme)?.label}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center gap-2 justify-center"
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>

          <Button
            onClick={saveSettings}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 justify-center"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}