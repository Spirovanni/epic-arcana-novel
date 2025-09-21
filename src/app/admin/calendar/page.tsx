'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Calendar, 
  Upload, 
  Download, 
  Save, 
  RefreshCw,
  Database,
  Palette,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { YearGrid } from '@/components/calendar/YearGrid';
import { AppNavbar } from '@/components/shared/AppNavbar';

interface DaySign {
  id: number;
  index0: number;
  name: string;
  color: string | null;
  glyph: string | null;
  mapping: {
    id: number | null;
    archetype: string | null;
    theme: string | null;
    reflection: string | null;
    ritual: string | null;
    keywords: string | null;
  } | null;
}

interface DayOverride {
  id: number;
  dayOfYear: number;
  title: string | null;
  description: string | null;
  ritual: string | null;
  tags: string | null;
}

interface CalendarSettings {
  anchor?: string;
  leapPolicy?: 'duplicate' | 'skip' | 'insert_after_Q4';
}

export default function AdminCalendarPage() {
  const [daySigns, setDaySigns] = useState<DaySign[]>([]);
  const [overrides, setOverrides] = useState<DayOverride[]>([]);
  const [settings, setSettings] = useState<CalendarSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editing states
  const [editingSign, setEditingSign] = useState<number | null>(null);
  const [editingOverride, setEditingOverride] = useState<number | null>(null);
  const [newOverride, setNewOverride] = useState<Partial<DayOverride>>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [signsRes, overridesRes, settingsRes] = await Promise.all([
        fetch('/api/day-signs'),
        fetch('/api/overrides'),
        fetch('/api/settings')
      ]);

      if (signsRes.ok) {
        const signsData = await signsRes.json();
        setDaySigns(signsData.data || []);
      }

      if (overridesRes.ok) {
        const overridesData = await overridesRes.json();
        setOverrides(overridesData.data || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData.data || {});
      }
    } catch (error) {
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSeedDatabase = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/hf-calendar/seed', {
        method: 'POST'
      });

      if (response.ok) {
        showMessage('success', 'Database seeded successfully');
        await loadAllData();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to seed database');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to seed database');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        showMessage('success', 'Settings saved successfully');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDaySignMapping = async (daySignId: number, mappingData: any) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/day-signs/${daySignId}/mapping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappingData)
      });

      if (response.ok) {
        showMessage('success', 'Day sign mapping saved');
        await loadAllData();
        setEditingSign(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save mapping');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to save mapping');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOverride = async (overrideData: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overrideData)
      });

      if (response.ok) {
        showMessage('success', 'Override saved');
        await loadAllData();
        setEditingOverride(null);
        setNewOverride({});
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save override');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to save override');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/import-export');
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hf-calendar-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showMessage('success', 'Data exported successfully');
      }
    } catch (error) {
      showMessage('error', 'Failed to export data');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const response = await fetch('/api/import-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showMessage('success', 'Data imported successfully');
        await loadAllData();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to import data');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Failed to import data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AppNavbar variant="admin" />
      
      {/* Page Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Calendar Administration</h1>
                <p className="text-sm text-muted-foreground">
                  Manage Human Framework Calendar settings and data
                </p>
              </div>
            </div>

            {message && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {message.type === 'success' ? 
                  <CheckCircle className="h-4 w-4" /> : 
                  <AlertTriangle className="h-4 w-4" />
                }
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="day-signs" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Day Signs
            </TabsTrigger>
            <TabsTrigger value="overrides" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overrides
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year Anchor (ISO Date)</label>
                    <Input
                      type="date"
                      value={settings.anchor?.split('T')[0] || ''}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        anchor: new Date(e.target.value).toISOString()
                      }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      The starting date for the calendar year
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Leap Year Policy</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={settings.leapPolicy || 'duplicate'}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        leapPolicy: e.target.value as any
                      }))}
                    >
                      <option value="duplicate">Duplicate (Feb 29 = Feb 28)</option>
                      <option value="skip">Skip (Feb 29 advances)</option>
                      <option value="insert_after_Q4">Insert after Q4</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      How to handle leap day February 29th
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Day Signs Tab */}
          <TabsContent value="day-signs" className="space-y-6">
            <div className="grid gap-4">
              {daySigns.map((sign) => (
                <Card key={sign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{sign.index0}</Badge>
                        <CardTitle className="text-lg">{sign.name}</CardTitle>
                        {sign.color && (
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: sign.color }}
                          />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSign(editingSign === sign.id ? null : sign.id)}
                      >
                        {editingSign === sign.id ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {editingSign === sign.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Archetype"
                          defaultValue={sign.mapping?.archetype || ''}
                          id={`archetype-${sign.id}`}
                        />
                        <Input
                          placeholder="Theme"
                          defaultValue={sign.mapping?.theme || ''}
                          id={`theme-${sign.id}`}
                        />
                      </div>
                      
                      <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="Reflection"
                        rows={3}
                        defaultValue={sign.mapping?.reflection || ''}
                        id={`reflection-${sign.id}`}
                      />
                      
                      <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="Ritual"
                        rows={3}
                        defaultValue={sign.mapping?.ritual || ''}
                        id={`ritual-${sign.id}`}
                      />
                      
                      <Input
                        placeholder="Keywords (comma-separated)"
                        defaultValue={sign.mapping?.keywords || ''}
                        id={`keywords-${sign.id}`}
                      />
                      
                      <Button
                        onClick={() => {
                          const archetype = (document.getElementById(`archetype-${sign.id}`) as HTMLInputElement)?.value;
                          const theme = (document.getElementById(`theme-${sign.id}`) as HTMLInputElement)?.value;
                          const reflection = (document.getElementById(`reflection-${sign.id}`) as HTMLTextAreaElement)?.value;
                          const ritual = (document.getElementById(`ritual-${sign.id}`) as HTMLTextAreaElement)?.value;
                          const keywords = (document.getElementById(`keywords-${sign.id}`) as HTMLInputElement)?.value;
                          
                          handleSaveDaySignMapping(sign.id, {
                            archetype, theme, reflection, ritual, keywords
                          });
                        }}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Mapping
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Overrides Tab */}
          <TabsContent value="overrides" className="space-y-6">
            {/* Add New Override */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Override</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    placeholder="Day of Year (1-365)"
                    value={newOverride.dayOfYear || ''}
                    onChange={(e) => setNewOverride(prev => ({
                      ...prev,
                      dayOfYear: parseInt(e.target.value)
                    }))}
                  />
                  <Input
                    placeholder="Title"
                    value={newOverride.title || ''}
                    onChange={(e) => setNewOverride(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                  />
                </div>
                
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Description"
                  rows={3}
                  value={newOverride.description || ''}
                  onChange={(e) => setNewOverride(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
                
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Ritual"
                  rows={3}
                  value={newOverride.ritual || ''}
                  onChange={(e) => setNewOverride(prev => ({
                    ...prev,
                    ritual: e.target.value
                  }))}
                />
                
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newOverride.tags || ''}
                  onChange={(e) => setNewOverride(prev => ({
                    ...prev,
                    tags: e.target.value
                  }))}
                />
                
                <Button
                  onClick={() => handleSaveOverride(newOverride)}
                  disabled={saving || !newOverride.dayOfYear}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Add Override
                </Button>
              </CardContent>
            </Card>

            {/* Existing Overrides */}
            <div className="grid gap-4">
              {overrides.map((override) => (
                <Card key={override.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Day {override.dayOfYear}
                          {override.title && ` • ${override.title}`}
                        </CardTitle>
                        {override.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {override.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingOverride(editingOverride === override.id ? null : override.id)}
                      >
                        {editingOverride === override.id ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {editingOverride === override.id && (
                    <CardContent className="space-y-4">
                      {/* Similar editing interface as new override */}
                      <div className="text-sm text-muted-foreground">
                        Edit functionality would go here...
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <YearGrid className="max-w-none" />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleSeedDatabase}
                    disabled={saving}
                    data-seed-database
                    className="w-full flex items-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    Seed Default Data
                  </Button>
                  
                  <Button
                    onClick={loadAllData}
                    disabled={loading}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Import/Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="import-file"
                    />
                    <Button
                      onClick={() => document.getElementById('import-file')?.click()}
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}