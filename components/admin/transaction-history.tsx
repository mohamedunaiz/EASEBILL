"use client"

import { useState } from "react"
import { regions, formatCurrency, type Region } from "@/lib/store"
import { Receipt, Calendar, CreditCard, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Transaction {
  id: string
  items: { name: string; quantity: number; price: number }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  region: string
  timestamp: Date
}

// Demo transactions
const demoTransactions: Transaction[] = [
  {
    id: "TXN001",
    items: [
      { name: "Organic Milk", quantity: 2, price: 584 },
      { name: "Whole Wheat Bread", quantity: 1, price: 209 },
    ],
    subtotal: 1377,
    tax: 69,
    total: 1446,
    paymentMethod: "upi",
    region: "india",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "TXN002",
    items: [
      { name: "Basmati Rice (5kg)", quantity: 1, price: 1002 },
      { name: "Olive Oil (1L)", quantity: 1, price: 668 },
    ],
    subtotal: 1670,
    tax: 170,
    total: 1840,
    paymentMethod: "card",
    region: "india",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "TXN003",
    items: [
      { name: "Fresh Apples (1kg)", quantity: 3, price: 12 },
      { name: "Dark Chocolate Bar", quantity: 2, price: 6 },
    ],
    subtotal: 18,
    tax: 1.08,
    total: 19.08,
    paymentMethod: "cash",
    region: "usa",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
]

export function TransactionHistory() {
  const [transactions] = useState<Transaction[]>(demoTransactions)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getRegion = (regionId: string): Region => {
    return regions.find((r) => r.id === regionId) || regions[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <p className="text-muted-foreground">View all completed transactions</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 bg-secondary/30 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((txn) => {
          const region = getRegion(txn.region)
          return (
            <div key={txn.id} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="font-semibold">{txn.id}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{txn.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-neon-cyan">{formatCurrency(txn.total, region)}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                    <CreditCard className="h-3 w-3" />
                    <span className="capitalize">{txn.paymentMethod}</span>
                    <span>• {region.name}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  {txn.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity, region)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border/30 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(txn.subtotal, region)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{region.taxName}</span>
                    <span>{formatCurrency(txn.tax, region)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 glass-card rounded-xl">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}
