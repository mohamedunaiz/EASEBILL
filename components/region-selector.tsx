"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { regions, type Region } from "@/lib/store"
import { Globe } from "lucide-react"

interface RegionSelectorProps {
  selectedRegion: Region
  onRegionChange: (region: Region) => void
}

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div className="glass-card rounded-lg p-3 flex items-center gap-3">
      <Globe className="h-4 w-4 text-neon-purple" />
      <Select
        value={selectedRegion.id}
        onValueChange={(value) => {
          const region = regions.find((r) => r.id === value)
          if (region) onRegionChange(region)
        }}
      >
        <SelectTrigger className="w-[180px] bg-transparent border-border/50">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {regions.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              <span className="flex items-center gap-2">
                <span>{region.currencySymbol}</span>
                <span>{region.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
