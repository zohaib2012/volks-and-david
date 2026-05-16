import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+92 300 1234567',
    href: 'tel:+923001234567',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@volksanddavid.com',
    href: 'mailto:info@volksanddavid.com',
  },
  {
    icon: MapPin,
    label: 'Office Address',
    value: '123 Main Boulevard, Gulberg III, Lahore, Pakistan',
    href: null,
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM',
    href: null,
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Volks & David</title>
        <meta name="description" content="Get in touch with Volks & David. Contact us for tax filing, NTN registration, GST, business services, and USA services." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? We are here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="p-12 rounded-2xl border bg-card text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                  <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border bg-card p-8">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                        <Input
                          required
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
                        <Input
                          required
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                        <Input
                          placeholder="+92 300 1234567"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Subject *</label>
                        <Input
                          required
                          placeholder="How can we help?"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Message *</label>
                      <Textarea
                        required
                        rows={6}
                        placeholder="Tell us more about your inquiry..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold text-lg mb-2">Prefer Live Chat?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available during business hours for instant assistance.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
