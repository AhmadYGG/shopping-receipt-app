'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Printer, Download, Lock, LogOut } from 'lucide-react'
import * as htmlToImage from 'html-to-image'

interface ReceiptItem {
  id: string
  name: string
  quantity: number
  price: number
}

export default function ShoppingReceipt() {
  const [storeName] = useState('Nova VapeStore')
  const [storeAddress] = useState('Jl. Maluku Depan Yonif 511 Utara Green Futsal')
  const [storePhone] = useState('081217224413')
  const [cashierName, setCashierName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ])
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [status, setStatus] = useState('Lunas')
  const [currentTime, setCurrentTime] = useState(new Date())

  const CORRECT_PASSWORD = 'vape123'

  // Check authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('isAuthenticated', 'true')
      setError('')
    } else {
      setError('Password salah! Silakan coba lagi.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('isAuthenticated')
    setPassword('')
    setError('')
  }

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Receipt Maker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="mt-1"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Masuk
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

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
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}-${month}-${year}`
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

  const handleSaveAsPNG = async () => {
    const node = document.getElementById('receipt')
    if (!node) return alert("Element receipt tidak ditemukan!")

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        backgroundColor: 'white',     // ← Wajib: background putih
        cacheBust: true,
        pixelRatio: 2                 // ← Export kualitas tinggi
      })

      const link = document.createElement('a')
      link.download = `nota-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error(error)
      alert("Gagal menyimpan PNG.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <h1 className="text-3xl font-bold text-center mb-8">RECEIPT MAKER</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Buat Nota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cashier Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                <Label htmlFor="cashierName">Nama Kasir</Label>
                </div>
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
                    <div key={item.id}>
                      {/* Desktop Layout */}
                      <div className="hidden sm:flex gap-2 items-center p-3 border rounded-lg">
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
                      
                      {/* Mobile Layout */}
                      <div className="sm:hidden p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium w-6">{index + 1}.</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            className="ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Nama barang"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            className="flex-1"
                            min="1"
                          />
                          <Input
                            type="number"
                            placeholder="Harga"
                            value={item.price || ''}
                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                            className="flex-1"
                            min="0"
                          />
                        </div>
                      </div>
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
                    <SelectItem value="QRIS">QRIS</SelectItem>
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
                <div className="flex gap-2">
                  <Button onClick={handleSaveAsPNG} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Simpan PNG
                  </Button>
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div id="receipt" className="bg-white p-6 border-2 border-dashed border-gray-300">
                {/* Receipt Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">{storeName || 'NAMA TOKO'}</h2>
                  {storeAddress && (
                    <p className="text-sm text-gray-600 mb-1">{storeAddress}</p>
                  )}
                  {storePhone && (
                    <p className="text-sm text-gray-600">Tel: {storePhone}</p>
                  )}
                </div>

                <Separator className="mb-4" />

                {/* Date and Time */}
                <div className="text-center mb-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-left">
                        <div>Kasir: <span>{cashierName || '-'}</span></div>
                      </div>
                      <div className="text-right">
                        <div>{formatDate(currentTime)}</div>
                        <div>{formatTime(currentTime)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Items Table */}
                <div className="mb-4">
                  {items.filter(item => item.name).map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 text-xs mb-1">
                      {/* <div className="col-span-1">{index + 1}</div> */}
                      <div className="col-span-6 truncate">{item.name}</div>
                      <div className="col-span-2 text-center">x{item.quantity}</div>
                      <div className="col-span-4 text-right">{formatCurrency(calculateSubtotal(item))}</div>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between items-center mt-8 mb-8">
          <Button onClick={handleLogout} variant="outline" className="no-print">
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
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