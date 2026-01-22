"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, ZapOff } from "lucide-react"

interface DemoModeToggleProps {
  demoMode: boolean
  onToggle: (enabled: boolean) => void
}

export function DemoModeToggle({ demoMode, onToggle }: DemoModeToggleProps) {
  return (
    <div className="glass-card rounded-lg p-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        {demoMode ? (
          <Zap className="h-4 w-4 text-neon-cyan animate-pulse" />
        ) : (
          <ZapOff className="h-4 w-4 text-muted-foreground" />
        )}
        <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
          Demo Mode
        </Label>
      </div>
      <Switch
        id="demo-mode"
        checked={demoMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-neon-cyan"
      />
      {demoMode && <span className="text-xs text-neon-cyan animate-pulse-glow">AI Simulation Active</span>}
    </div>
  )
}
