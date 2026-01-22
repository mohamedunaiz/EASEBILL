"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { regions } from "@/lib/store"
import { Save, RefreshCw } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    storeName: "AI Billing System",
    defaultRegion: "india",
    autoAddToCart: true,
    soundEffects: true,
    aiConfidenceThreshold: 85,
  })

  const [taxRates, setTaxRates] = useState<Record<string, number[]>>({
    india: [0, 5, 12, 18, 28],
    usa: [0, 5, 7, 8.5, 10],
    uk: [0, 5, 12.5, 20],
    eu: [0, 5, 10, 20, 25],
    uae: [0, 5],
    japan: [0, 8, 10],
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure your billing system</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="bg-secondary/30 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Default Region</Label>
              <select
                value={settings.defaultRegion}
                onChange={(e) => setSettings({ ...settings, defaultRegion: e.target.value })}
                className="w-full h-10 px-3 rounded-md bg-secondary/30 border border-border/50 text-foreground"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.currency})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>AI Confidence Threshold (%)</Label>
              <Input
                type="number"
                min="50"
                max="100"
                value={settings.aiConfidenceThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    aiConfidenceThreshold: Number.parseInt(e.target.value),
                  })
                }
                className="bg-secondary/30 border-border/50"
              />
              <p className="text-xs text-muted-foreground">Minimum confidence level for automatic product detection</p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Feature Toggles</CardTitle>
            <CardDescription>Enable or disable system features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Add to Cart</Label>
                <p className="text-sm text-muted-foreground">Automatically add detected products</p>
              </div>
              <Switch
                checked={settings.autoAddToCart}
                onCheckedChange={(checked) => setSettings({ ...settings, autoAddToCart: checked })}
                className="data-[state=checked]:bg-neon-cyan"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds on detection and payment</p>
              </div>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                className="data-[state=checked]:bg-neon-cyan"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Configuration */}
        <Card className="glass-card border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>Configure tax rates for each region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map((region) => (
                <div key={region.id} className="p-4 rounded-lg bg-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{region.name}</span>
                    <span className="text-sm text-muted-foreground">{region.taxName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {taxRates[region.id]?.map((rate, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs rounded bg-secondary/50">
                        {rate}%
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-neon-cyan hover:bg-neon-cyan/90 text-background">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
