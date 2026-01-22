"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Scan, AlertCircle } from "lucide-react"
import type { Product } from "@/lib/store"

interface CameraScannerProps {
  demoMode: boolean
  products: Product[]
  onProductDetected: (product: Product) => void
}

export function CameraScanner({ demoMode, products, onProductDetected }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [detectedProduct, setDetectedProduct] = useState<Product | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraError(null)
      } catch {
        setCameraError("Camera access denied or unavailable")
      }
    }

    if (!demoMode) {
      startCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [demoMode])

  // Demo mode: Simulate AI detection
  useEffect(() => {
    if (!demoMode) return

    const interval = setInterval(() => {
      const activeProducts = products.filter((p) => p.active)
      if (activeProducts.length === 0) return

      setIsScanning(true)

      setTimeout(() => {
        const randomProduct = activeProducts[Math.floor(Math.random() * activeProducts.length)]
        setDetectedProduct(randomProduct)
        onProductDetected(randomProduct)

        setTimeout(() => {
          setDetectedProduct(null)
          setIsScanning(false)
        }, 1500)
      }, 1000)
    }, 4000)

    return () => clearInterval(interval)
  }, [demoMode, products, onProductDetected])

  return (
    <div className="glass-card rounded-xl overflow-hidden relative">
      <div className="aspect-video bg-background/50 relative">
        {demoMode ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5">
            <div className="text-center">
              <div className="relative">
                <Camera className="h-20 w-20 text-neon-cyan/30 mx-auto" />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 border-2 border-neon-cyan rounded-lg animate-pulse neon-glow" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mt-4 text-sm">Demo Mode - AI Simulation Active</p>
              <p className="text-neon-cyan text-xs mt-1 animate-pulse">Scanning for products...</p>
            </div>
          </div>
        ) : cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">{cameraError}</p>
            </div>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-4 border-2 border-neon-cyan/50 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan" />
            </div>
            <div className="absolute inset-4 overflow-hidden rounded-lg">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent scan-animation" />
            </div>
          </div>
        )}

        {/* Detection result */}
        {detectedProduct && (
          <div className="absolute bottom-4 left-4 right-4 glass-card rounded-lg p-3 neon-glow animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <Scan className="h-5 w-5 text-neon-cyan" />
              <div>
                <p className="font-semibold text-foreground">{detectedProduct.name}</p>
                <p className="text-xs text-muted-foreground">{detectedProduct.category}</p>
              </div>
              <span className="ml-auto text-neon-cyan font-mono text-sm">✓ Detected</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${demoMode || !cameraError ? "bg-neon-cyan animate-pulse" : "bg-destructive"}`}
            />
            <span className="text-sm text-muted-foreground">
              {demoMode ? "Demo Mode" : cameraError ? "Camera Error" : "Live Camera"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">AI Vision v2.0</span>
        </div>
      </div>
    </div>
  )
}
