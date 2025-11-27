'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Printer } from 'lucide-react'

interface ReceiptItem {
  id: string
  name: string
  quantity: number
  price: number
}

export default function ShoppingReceipt() {
  const [storeName, setStoreName] = useState('TOKO KELONTONG')
  const [cashierName, setCashierName] = useState('Kasir')
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ])
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [status, setStatus] = useState('Lunas')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'name' ? value : Number(value) || 0 }
      }
      return item
    }))
  }

  const calculateSubtotal = (item: ReceiptItem) => {
    return item.quantity * item.price
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateSubtotal(item), 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getDayName = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return days[date.getDay()]
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Aplikasi Nota Belanja</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Buat Nota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Name */}
              <div>
                <Label htmlFor="storeName">Nama Toko</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Masukkan nama toko"
                />
              </div>

              {/* Cashier Name */}
              <div>
                <Label htmlFor="cashierName">Nama Kasir</Label>
                <Input
                  id="cashierName"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  placeholder="Masukkan nama kasir"
                />
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Daftar Barang</Label>
                  <Button onClick={addItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Barang
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-center p-3 border rounded-lg">
                      <span className="text-sm font-medium w-8">{index + 1}.</span>
                      <Input
                        placeholder="Nama barang"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="w-20"
                        min="1"
                      />
                      <Input
                        type="number"
                        placeholder="Harga"
                        value={item.price || ''}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                        className="w-32"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label htmlFor="paymentMethod">Pembayaran Via</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunai">Tunai</SelectItem>
                    <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                    <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                    <SelectItem value="Kartu Debit">Kartu Debit</SelectItem>
                    <SelectItem value="Kartu Kredit">Kartu Kredit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lunas">Lunas</SelectItem>
                    <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                    <SelectItem value="DP">DP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Preview Nota</CardTitle>
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Cetak
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div id="receipt" className="bg-white p-6 border-2 border-dashed border-gray-300">
                {/* Receipt Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">{storeName || 'NAMA TOKO'}</h2>
                  <p className="text-sm text-gray-600">Jl. Contoh No. 123, Jakarta</p>
                  <p className="text-sm text-gray-600">Tel: 021-12345678</p>
                </div>

                <Separator className="mb-4" />

                {/* Date and Time */}
                <div className="text-center mb-4">
                  <p className="text-sm">{getDayName(currentTime)}, {formatDate(currentTime)}</p>
                  <p className="text-sm">{formatTime(currentTime)}</p>
                </div>

                <Separator className="mb-4" />

                {/* Items Table */}
                <div className="mb-4">
                  <div className="grid grid-cols-12 text-xs font-bold mb-2">
                    <div className="col-span-1">No</div>
                    <div className="col-span-5">Barang</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Harga</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  <Separator className="mb-2" />

                  {items.filter(item => item.name).map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 text-xs mb-1">
                      <div className="col-span-1">{index + 1}</div>
                      <div className="col-span-5 truncate">{item.name}</div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-right">{formatCurrency(item.price)}</div>
                      <div className="col-span-2 text-right">{formatCurrency(calculateSubtotal(item))}</div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Total */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Payment Info */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Pembayaran:</span>
                    <span>{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className={`font-bold ${status === 'Lunas' ? 'text-green-600' : status === 'Belum Lunas' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Cashier Info */}
                <div className="text-center">
                  <p className="text-xs mb-2">Terima Kasih</p>
                  <p className="text-xs mb-4">Selamat Berbelanja Kembali</p>
                  <div className="mt-6">
                    <p className="text-xs mb-1">Kasir:</p>
                    <p className="text-sm font-bold">{cashierName || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt,
          #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}