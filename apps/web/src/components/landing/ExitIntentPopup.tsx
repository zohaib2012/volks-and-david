import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

const STORAGE_KEY = 'vd-exit-intent-dismissed'

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    const timer = setTimeout(() => setTimeElapsed(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (!timeElapsed || visible) return
      if (e.clientY <= 0) {
        const dismissed = sessionStorage.getItem(STORAGE_KEY)
        if (!dismissed) {
          setVisible(true)
        }
      }
    },
    [timeElapsed, visible]
  )

  useEffect(() => {
    if (!timeElapsed) return
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [timeElapsed, handleMouseLeave])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      await api.post('/contact', {
        name: 'Exit Intent Lead',
        email,
        phone: '',
        serviceInterest: '10% Off Offer',
        message: 'Claimed 10% off first service via exit intent popup',
      })
    } catch {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Exit Intent Lead',
            email,
            phone: '',
            serviceInterest: '10% Off Offer',
            message: 'Claimed 10% off first service via exit intent popup',
          }),
        })
      } catch {
        // silent
      }
    } finally {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 shadow-2xl"
          >
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-lg p-1.5 opacity-70 hover:opacity-100 hover:bg-muted transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            {success ? (
              <div className="flex flex-col items-center text-center py-4 space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#C8952E]/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-[#C8952E]" />
                </div>
                <h3 className="text-xl font-bold">Offer Claimed!</h3>
                <p className="text-sm text-muted-foreground">
                  Check your email for your 10% discount code. Use it on your first service!
                </p>
                <Button variant="outline" onClick={handleDismiss}>
                  Continue Browsing
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Get <span className="text-primary">10% OFF</span>
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Your first service — on us! Enter your email and claim your discount.
                  </p>
                </div>

                <form onSubmit={handleClaim} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Claim Offer'
                    )}
                  </Button>
                </form>

                <p className="text-xs text-center text-muted-foreground">
                  No spam, unsubscribe anytime. Valid for new customers only.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
