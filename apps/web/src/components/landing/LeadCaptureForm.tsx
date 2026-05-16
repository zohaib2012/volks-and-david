import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

const services = [
  'Income Tax Return',
  'NTN Registration',
  'GST Registration',
  'SECP Company Registration',
  'Trademark Registration',
  'Copyright Registration',
  'Patent Filing',
  'USA LLC Formation',
  'USA EIN Registration',
  'USA ITIN Application',
  'Tax Consultation',
  'Other',
]

interface LeadCaptureFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export default function LeadCaptureForm({
  open,
  onOpenChange,
  title = 'Get Free Consultation',
  description = 'Fill out the form below and our team will get back to you within 24 hours.',
}: LeadCaptureFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'
    if (!phone.trim()) newErrors.phone = 'Phone is required'
    if (!service) newErrors.service = 'Please select a service'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError('')

    try {
      await api.post('/contact', { name, email, phone, serviceInterest: service })
      setSuccess(true)
      setName('')
      setEmail('')
      setPhone('')
      setService('')
    } catch {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, serviceInterest: service }),
        })
        if (!res.ok) throw new Error('Failed to submit')
        setSuccess(true)
        setName('')
        setEmail('')
        setPhone('')
        setService('')
      } catch {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChangeWrapper = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setSuccess(false)
        setError('')
        setErrors({})
      }, 300)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{success ? 'Thank You!' : title}</DialogTitle>
          <DialogDescription>
            {success
              ? 'We have received your request and will contact you within 24 hours.'
              : description}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              A member of our team will reach out to discuss your requirements.
            </p>
            <Button variant="outline" onClick={() => handleOpenChangeWrapper(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(errors.phone && 'border-destructive')}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service Interest</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className={cn(errors.service && 'border-destructive')}>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
