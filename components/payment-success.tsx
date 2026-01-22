"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Receipt, ArrowRight } from "lucide-react"
import { type Region, formatCurrency } from "@/lib/store"

interface PaymentSuccessProps {
  total: number
  region: Region
  paymentMethod: string
  onNewTransaction: () => void
}

export function PaymentSuccess({ total, region, paymentMethod, onNewTransaction }: PaymentSuccessProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full mx-4 text-center neon-glow animate-in zoom-in-95">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-neon-cyan/20 animate-ping" />
          </div>
          <CheckCircle className="h-20 w-20 text-neon-cyan mx-auto relative" />
        </div>

        <h2 className="text-2xl font-bold mt-6 neon-text">Payment Successful!</h2>
        <p className="text-muted-foreground mt-2">Thank you for your purchase</p>

        <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Receipt className="h-4 w-4" />
            <span className="text-sm">Transaction Details</span>
          </div>
          <p className="text-3xl font-bold text-neon-cyan mt-2 neon-text">{formatCurrency(total, region)}</p>
          <p className="text-sm text-muted-foreground mt-1 capitalize">Paid via {paymentMethod}</p>
        </div>

        <Button
          className="w-full mt-6 h-12 bg-neon-cyan hover:bg-neon-cyan/90 text-background font-semibold"
          onClick={onNewTransaction}
        >
          Start New Transaction
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
