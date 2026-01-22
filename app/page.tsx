"use client"

import { useState, useCallback } from "react"
import { CameraScanner } from "@/components/camera-scanner"
import { ShoppingCartComponent } from "@/components/shopping-cart"
import { PaymentSection } from "@/components/payment-section"
import { PaymentSuccess } from "@/components/payment-success"
import { RegionSelector } from "@/components/region-selector"
import { DemoModeToggle } from "@/components/demo-mode-toggle"
import { defaultProducts, regions, type Product, type CartItem, type Region, getProductPrice } from "@/lib/store"
import { Cpu, Shield } from "lucide-react"
import Link from "next/link"

export default function CustomerCheckout() {
  const [demoMode, setDemoMode] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0])
  const [products] = useState<Product[]>(defaultProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastPayment, setLastPayment] = useState<{ total: number; method: string } | null>(null)

  const handleProductDetected = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
    } else {
      setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handlePaymentComplete = (method: string) => {
    const subtotal = cart.reduce((total, item) => {
      const price = getProductPrice(item.product, selectedRegion.id)
      return total + price * item.quantity
    }, 0)
    const tax = cart.reduce((total, item) => {
      const price = getProductPrice(item.product, selectedRegion.id)
      const itemTotal = price * item.quantity
      return total + (itemTotal * item.product.gstRate) / 100
    }, 0)

    setLastPayment({ total: subtotal + tax, method })
    setShowSuccess(true)
  }

  const handleNewTransaction = () => {
    setCart([])
    setShowSuccess(false)
    setLastPayment(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center neon-glow">
                <Cpu className="h-5 w-5 text-neon-cyan" />
              </div>
              <div>
                <h1 className="font-bold text-lg neon-text">AI Billing System</h1>
                <p className="text-xs text-muted-foreground">Touchless Checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <DemoModeToggle demoMode={demoMode} onToggle={setDemoMode} />
              <RegionSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
              <Link
                href="/admin"
                className="glass-card rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Scanner */}
          <div className="lg:col-span-2 space-y-6">
            <CameraScanner demoMode={demoMode} products={products} onProductDetected={handleProductDetected} />

            {/* Instructions */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">How to Use</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Place your product in front of the camera</li>
                <li>2. AI will automatically detect and add it to your cart</li>
                <li>3. Review your cart and proceed to payment</li>
                <li>4. Select your preferred payment method and complete checkout</li>
              </ol>
            </div>
          </div>

          {/* Cart & Payment */}
          <div className="space-y-6">
            <ShoppingCartComponent
              items={cart}
              region={selectedRegion}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
            <PaymentSection items={cart} region={selectedRegion} onPaymentComplete={handlePaymentComplete} />
          </div>
        </div>
      </main>

      {/* Payment Success Modal */}
      {showSuccess && lastPayment && (
        <PaymentSuccess
          total={lastPayment.total}
          region={selectedRegion}
          paymentMethod={lastPayment.method}
          onNewTransaction={handleNewTransaction}
        />
      )}
    </div>
  )
}
