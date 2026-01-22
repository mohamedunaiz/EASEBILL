"use client"

import { Button } from "@/components/ui/button"
import { type CartItem, type Region, getProductPrice, formatCurrency } from "@/lib/store"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"

interface ShoppingCartProps {
  items: CartItem[]
  region: Region
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export function ShoppingCartComponent({ items, region, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = getProductPrice(item.product, region.id)
      return total + price * item.quantity
    }, 0)
  }

  const calculateTax = () => {
    return items.reduce((total, item) => {
      const price = getProductPrice(item.product, region.id)
      const itemTotal = price * item.quantity
      return total + (itemTotal * item.product.gstRate) / 100
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax()
  const total = subtotal + tax

  return (
    <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-neon-cyan" />
          <h2 className="font-semibold text-lg">Shopping Cart</h2>
          <span className="ml-auto text-sm text-muted-foreground">{items.length} items</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Cart is empty</p>
            <p className="text-xs mt-1">Place items in front of the camera</p>
          </div>
        ) : (
          items.map((item) => {
            const price = getProductPrice(item.product, region.id)
            return (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(price, region)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-4 border-t border-border/50 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal, region)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{region.taxName}</span>
          <span>{formatCurrency(tax, region)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border/50">
          <span>Total</span>
          <span className="text-neon-cyan neon-text">{formatCurrency(total, region)}</span>
        </div>
      </div>
    </div>
  )
}
