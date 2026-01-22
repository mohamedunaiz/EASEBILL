"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react"

export function Analytics() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,231",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-neon-cyan",
    },
    {
      title: "Total Orders",
      value: "124",
      change: "+15.3%",
      icon: ShoppingBag,
      color: "text-neon-purple",
    },
    {
      title: "Active Products",
      value: "8",
      change: "+2",
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      title: "Daily Customers",
      value: "42",
      change: "+12.5%",
      icon: Users,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-400 mt-1">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Revenue chart visualization</p>
              <p className="text-sm">Connect a database for real-time analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Basmati Rice (5kg)", sales: 45, revenue: "₹45,090" },
              { name: "Organic Milk", sales: 38, revenue: "₹11,096" },
              { name: "Olive Oil (1L)", sales: 32, revenue: "₹21,376" },
              { name: "Fresh Apples (1kg)", sales: 28, revenue: "₹9,352" },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-mono">#{idx + 1}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neon-cyan">{product.revenue}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
