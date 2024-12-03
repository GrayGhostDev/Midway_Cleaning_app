import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

interface SettingsFormData {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

export function SettingsForm() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsFormData>({
    theme: 'system',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
    },
    privacy: {
      shareData: true,
      analytics: true,
      marketing: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Settings update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    section: keyof SettingsFormData,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...prev[section], [key]: value }
        : value
    }));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium">
              Theme
            </label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleChange('theme', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium">
              Language
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleChange('language', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Regional */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Regional</h3>
          
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium">
              Timezone
            </label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium">
              Date Format
            </label>
            <select
              id="dateFormat"
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium">
              Currency
            </label>
            <select
              id="currency"
              value={settings.currency}
              onChange={(e) => handleChange('currency', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        {/* Accessibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Accessibility</h3>
          
          <div className="flex items-center justify-between">
            <label htmlFor="highContrast" className="text-sm font-medium">
              High Contrast
            </label>
            <Switch
              id="highContrast"
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => 
                handleChange('accessibility', 'highContrast', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="reducedMotion" className="text-sm font-medium">
              Reduced Motion
            </label>
            <Switch
              id="reducedMotion"
              checked={settings.accessibility.reducedMotion}
              onCheckedChange={(checked) => 
                handleChange('accessibility', 'reducedMotion', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="screenReader" className="text-sm font-medium">
              Screen Reader Optimization
            </label>
            <Switch
              id="screenReader"
              checked={settings.accessibility.screenReader}
              onCheckedChange={(checked) => 
                handleChange('accessibility', 'screenReader', checked)
              }
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy</h3>
          
          <div className="flex items-center justify-between">
            <label htmlFor="shareData" className="text-sm font-medium">
              Share Usage Data
            </label>
            <Switch
              id="shareData"
              checked={settings.privacy.shareData}
              onCheckedChange={(checked) => 
                handleChange('privacy', 'shareData', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="analytics" className="text-sm font-medium">
              Analytics
            </label>
            <Switch
              id="analytics"
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) => 
                handleChange('privacy', 'analytics', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="marketing" className="text-sm font-medium">
              Marketing Communications
            </label>
            <Switch
              id="marketing"
              checked={settings.privacy.marketing}
              onCheckedChange={(checked) => 
                handleChange('privacy', 'marketing', checked)
              }
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </Card>
  );
}
