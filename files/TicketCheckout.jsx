import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, Smartphone, FileText, MapPin, User, Mail, Phone, IdCard, Truck, Download, QrCode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'

// Configurar Stripe (usar chave pública)
const stripePromise = loadStripe('pk_test_...')  // Substituir pela chave pública do Stripe

const CheckoutForm = ({ evento, ticketType, quantity, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [deliveryMethod, setDeliveryMethod] = useState('digital')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: ''
  })

  const total = ticketType.price * quantity

  useEffect(() => {
    // Criar Payment Intent
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('https://e5h6i7c0x97j.manus.space/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: evento.id,
          ticket_type_id: ticketType.id,
          quantity: quantity,
          delivery_method: deliveryMethod
        })
      })

      const data = await response.json()
      if (data.success) {
        setClientSecret(data.client_secret)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao criar pedido')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      let result

      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement)
        
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
            },
          }
        })
      } else if (paymentMethod === 'pix') {
        result = await stripe.confirmPixPayment(clientSecret, {
          payment_method: {
            pix: {},
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
            },
          },
          return_url: window.location.href,
        })
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        // Pagamento bem-sucedido
        onSuccess(result.paymentIntent)
      }
    } catch (err) {
      setError('Erro no processamento do pagamento')
    }

    setLoading(false)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumo do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">{evento.titulo}</span>
            </div>
            <div className="flex justify-between">
              <span>{ticketType.name} x {quantity}</span>
              <span>R$ {(ticketType.price * quantity).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="document">CPF *</Label>
              <Input
                id="document"
                value={customerInfo.document}
                onChange={(e) => setCustomerInfo({...customerInfo, document: e.target.value})}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Digital</span>
              </TabsTrigger>
              <TabsTrigger value="physical" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Físico</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="digital" className="mt-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium">Ingresso Digital</p>
                  <p className="text-sm text-gray-600">
                    Receba seus ingressos por e-mail com QR Code para validação
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="physical" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <Truck className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-medium">Entrega Física</p>
                    <p className="text-sm text-gray-600">
                      Ingressos impressos entregues em sua residência
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Endereço de Entrega *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    placeholder="Rua, número, bairro, cidade, CEP"
                    required={deliveryMethod === 'physical'}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Método de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Cartão</span>
              </TabsTrigger>
              <TabsTrigger value="pix" className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>PIX</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="mt-4">
              <div className="space-y-4">
                <Label>Dados do Cartão</Label>
                <div className="p-4 border rounded-lg">
                  <CardElement options={cardElementOptions} />
                </div>
                <p className="text-sm text-gray-600">
                  Aceitamos Visa, Mastercard, American Express e Elo
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="pix" className="mt-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Smartphone className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium">Pagamento via PIX</p>
                  <p className="text-sm text-gray-600">
                    Você será redirecionado para completar o pagamento
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Erro */}
      {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Botões */}
      <div className="flex space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={!stripe || loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              Finalizar Compra - R$ {total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

const TicketCheckout = ({ evento, ticketType, quantity, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        evento={evento}
        ticketType={ticketType}
        quantity={quantity}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  )
}

const SuccessModal = ({ isOpen, tickets, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <DialogTitle>Compra Realizada!</DialogTitle>
              <DialogDescription>
                Seus ingressos foram gerados com sucesso
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              Você receberá os ingressos por e-mail em alguns minutos.
              Guarde bem os códigos QR para a entrada no evento.
            </p>
          </div>
          
          {tickets && tickets.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Seus Ingressos:</h4>
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Ingresso #{index + 1}</span>
                  <Badge variant="secondary">{ticket.validation_code}</Badge>
                </div>
              ))}
            </div>
          )}
          
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { TicketCheckout, SuccessModal }

