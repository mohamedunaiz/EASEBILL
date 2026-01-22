"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { defaultProducts, regions, type Product, formatCurrency } from "@/lib/store"
import { Plus, Edit2, Trash2, Package } from "lucide-react"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    basePrice: "",
    gstRate: "18",
    image: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      basePrice: "",
      gstRate: "18",
      image: "",
    })
  }

  const handleAddProduct = () => {
    const basePrice = Number.parseFloat(formData.basePrice)
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      basePrice,
      prices: {
        india: Math.round(basePrice * 83.5),
        usa: basePrice,
        uk: Math.round(basePrice * 0.79 * 100) / 100,
        eu: Math.round(basePrice * 0.92 * 100) / 100,
        uae: Math.round(basePrice * 3.67 * 100) / 100,
        japan: Math.round(basePrice * 149.5),
      },
      gstRate: Number.parseInt(formData.gstRate),
      image: formData.image || `/placeholder.svg?height=100&width=100&query=${formData.name}`,
      active: true,
    }

    setProducts([...products, newProduct])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    const basePrice = Number.parseFloat(formData.basePrice)
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      category: formData.category,
      basePrice,
      prices: {
        india: Math.round(basePrice * 83.5),
        usa: basePrice,
        uk: Math.round(basePrice * 0.79 * 100) / 100,
        eu: Math.round(basePrice * 0.92 * 100) / 100,
        uae: Math.round(basePrice * 3.67 * 100) / 100,
        japan: Math.round(basePrice * 149.5),
      },
      gstRate: Number.parseInt(formData.gstRate),
      image: formData.image || editingProduct.image,
    }

    setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    setEditingProduct(null)
    resetForm()
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice.toString(),
      gstRate: product.gstRate.toString(),
      image: product.image,
    })
  }

  const categories = ["Dairy", "Bakery", "Fruits", "Vegetables", "Grains", "Beverages", "Snacks", "Cooking"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage your product catalog with region-based pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neon-cyan hover:bg-neon-cyan/90 text-background">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog. Prices will be automatically calculated for all regions.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleAddProduct}
              submitLabel="Add Product"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`glass-card rounded-xl p-4 transition-all ${!product.active ? "opacity-50" : ""}`}
          >
            <div className="flex items-start gap-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <Switch
                    checked={product.active}
                    onCheckedChange={() => handleToggleActive(product.id)}
                    className="data-[state=checked]:bg-neon-cyan"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-xs text-muted-foreground mt-1">Tax: {product.gstRate}%</p>
              </div>
            </div>

            {/* Region Prices */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {regions.slice(0, 6).map((region) => (
                <div key={region.id} className="text-center p-2 rounded bg-secondary/30">
                  <p className="text-xs text-muted-foreground">{region.currency}</p>
                  <p className="text-sm font-mono">{formatCurrency(product.prices[region.id], region)}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Dialog
                open={editingProduct?.id === product.id}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditingProduct(null)
                    resetForm()
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Update product details. Prices will be recalculated for all regions.
                    </DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    onSubmit={handleUpdateProduct}
                    submitLabel="Update Product"
                  />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive bg-transparent"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 glass-card rounded-xl">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">Add your first product to get started</p>
        </div>
      )}
    </div>
  )
}

interface ProductFormProps {
  formData: {
    name: string
    category: string
    basePrice: string
    gstRate: string
    image: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  categories: string[]
  onSubmit: () => void
  submitLabel: string
}

function ProductForm({ formData, setFormData, categories, onSubmit, submitLabel }: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          className="bg-secondary/30 border-border/50"
        />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="bg-secondary/30 border-border/50">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Base Price (USD)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            placeholder="0.00"
            className="bg-secondary/30 border-border/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Tax Rate (%)</Label>
          <Select value={formData.gstRate} onValueChange={(value) => setFormData({ ...formData, gstRate: value })}>
            <SelectTrigger className="bg-secondary/30 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 12, 18, 28].map((rate) => (
                <SelectItem key={rate} value={rate.toString()}>
                  {rate}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image URL (Optional)</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
          className="bg-secondary/30 border-border/50"
        />
      </div>
      <Button
        className="w-full bg-neon-cyan hover:bg-neon-cyan/90 text-background"
        onClick={onSubmit}
        disabled={!formData.name || !formData.category || !formData.basePrice}
      >
        {submitLabel}
      </Button>
    </div>
  )
}
