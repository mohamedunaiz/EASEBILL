"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type CartItem, type Region, getProductPrice, formatCurrency } from "@/lib/store"
import { CreditCard, Banknote, Smartphone, Check, Loader2 } from "lucide-react"

interface PaymentSectionProps {
  items: CartItem[]
  region: Region
  onPaymentComplete: (method: string) => void
}

type PaymentMethod = "cash" | "upi" | "card"

export function PaymentSection({ items, region, onPaymentComplete }: PaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [processing, setProcessing] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")

  const calculateTotal = () => {
    const subtotal = items.reduce((total, item) => {
      const price = getProductPrice(item.product, region.id)
      return total + price * item.quantity
    }, 0)
    const tax = items.reduce((total, item) => {
      const price = getProductPrice(item.product, region.id)
      const itemTotal = price * item.quantity
      return total + (itemTotal * item.product.gstRate) / 100
    }, 0)
    return subtotal + tax
  }

  const handlePayment = async () => {
    if (!selectedMethod || items.length === 0) return

    setProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setProcessing(false)
    onPaymentComplete(selectedMethod)
  }

  const total = calculateTotal()
  const paymentMethods = [
    { id: "cash" as PaymentMethod, icon: Banknote, label: "Cash", color: "text-green-400" },
    { id: "upi" as PaymentMethod, icon: Smartphone, label: "UPI", color: "text-neon-purple" },
    { id: "card" as PaymentMethod, icon: CreditCard, label: "Card", color: "text-neon-cyan" },
  ]

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h2 className="font-semibold text-lg">Payment</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer Details (Optional) */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Name (Optional)
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 bg-secondary/30 border-border/50"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 bg-secondary/30 border-border/50"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Select Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map(({ id, icon: Icon, label, color }) => (
              <button
                key={id}
                onClick={() => setSelectedMethod(id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === id
                    ? "border-neon-cyan bg-neon-cyan/10 neon-glow"
                    : "border-border/50 bg-secondary/20 hover:border-border"
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-1 ${color}`} />
                <p className="text-xs text-center">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Total & Pay Button */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-neon-cyan neon-text">{formatCurrency(total, region)}</span>
          </div>
          <Button
            className="w-full h-12 text-lg font-semibold bg-neon-cyan hover:bg-neon-cyan/90 text-background"
            disabled={!selectedMethod || items.length === 0 || processing}
            onClick={handlePayment}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                Pay {formatCurrency(total, region)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
