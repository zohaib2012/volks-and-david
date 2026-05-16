import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, FileText, UserCheck, Receipt, Percent, Briefcase, MessageCircle, Globe, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'

interface ServicePrice {
  id: string
  name: string
  price: number
}

interface Settings {
  general: {
    siteName: string
    tagline: string
    contactEmail: string
    contactPhone: string
  }
  pricing: ServicePrice[]
}

const defaultServices = [
  {
    category: 'Income Tax Returns',
    icon: FileText,
    key: 'taxReturn',
    items: [
      { service: 'Salaried Individual (Single Year)', price: 'PKR 1,500' },
      { service: 'Salaried Individual (Previous Year)', price: 'PKR 2,500' },
      { service: 'Freelancer / Sole Proprietor', price: 'PKR 3,000' },
      { service: 'Business / AOP Return', price: 'PKR 5,000' },
      { service: 'Company Return', price: 'PKR 10,000' },
      { service: 'Each Additional Year', price: 'PKR 1,000' },
    ],
  },
  {
    category: 'NTN Registration',
    icon: UserCheck,
    key: 'ntn',
    items: [
      { service: 'NTN Registration (Salaried)', price: 'PKR 1,500' },
      { service: 'NTN Registration (Business)', price: 'PKR 2,500' },
      { service: 'NTN Certificate Retrieval', price: 'PKR 500' },
      { service: 'Profile Amendment', price: 'PKR 1,000' },
    ],
  },
  {
    category: 'GST / Sales Tax',
    icon: Receipt,
    key: 'gst',
    items: [
      { service: 'GST Registration', price: 'PKR 3,000' },
      { service: 'Monthly Sales Tax Return', price: 'PKR 1,500/mo' },
      { service: 'Quarterly Return Filing', price: 'PKR 3,000/qtr' },
      { service: 'Sales Tax Notice Handling', price: 'PKR 5,000' },
    ],
  },
  {
    category: 'Withholding Tax',
    icon: Percent,
    key: 'withholding',
    items: [
      { service: 'Monthly WHT Statement', price: 'PKR 2,000/mo' },
      { service: 'Annual WHT Reconciliation', price: 'PKR 5,000' },
      { service: 'WHT Certificate Issuance', price: 'PKR 500/cert' },
    ],
  },
  {
    category: 'Business & Legal',
    icon: Briefcase,
    key: 'business',
    items: [
      { service: 'SECP Company Registration', price: 'PKR 15,000' },
      { service: 'Trademark Registration (IPO)', price: 'PKR 12,000' },
      { service: 'Copyright Registration', price: 'PKR 10,000' },
      { service: 'Patent Filing', price: 'PKR 25,000' },
    ],
  },
  {
    category: 'Consultations',
    icon: MessageCircle,
    key: 'consultations',
    items: [
      { service: 'Chat Consultation', price: 'PKR 1,000' },
      { service: 'Phone Consultation (30 min)', price: 'PKR 2,000' },
      { service: 'Video Consultation (30 min)', price: 'PKR 3,000' },
      { service: 'Email Consultation', price: 'PKR 1,500' },
      { service: 'Annual Retainer (Individual)', price: 'PKR 15,000/yr' },
      { service: 'Annual Retainer (Business)', price: 'PKR 50,000/yr' },
    ],
  },
  {
    category: 'USA Services',
    icon: Globe,
    key: 'usa',
    items: [
      { service: 'LLC Formation', price: 'USD 299' },
      { service: 'EIN Registration', price: 'USD 99' },
      { service: 'ITIN Application', price: 'USD 199' },
      { service: 'US Bank Account Opening', price: 'USD 149' },
      { service: 'Complete USA Package', price: 'USD 599' },
    ],
  },
]

function formatPrice(price: number, isUSD: boolean): string {
  if (isUSD) {
    return `USD ${price.toLocaleString('en-US')}`
  }
  return `PKR ${price.toLocaleString('en-PK')}`
}

function SkeletonTable() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="h-7 w-48 bg-muted rounded" />
          </div>
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="border-b bg-muted/50 p-4">
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="border-b last:border-0 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  <div className="h-4 w-56 bg-muted rounded" />
                </div>
                <div className="h-6 w-24 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const groupVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export default function PricingPage() {
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const res = await api.get('/admin/settings')
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const priceMap = useMemo(() => {
    if (!settings?.pricing) return new Map<string, number>()
    const map = new Map<string, number>()
    settings.pricing.forEach((p) => {
      map.set(p.name.toLowerCase(), p.price)
    })
    return map
  }, [settings?.pricing])

  const services = useMemo(() => {
    return defaultServices.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        const key = item.service.toLowerCase()
        const matchedPrice = priceMap.get(key)
        if (matchedPrice !== undefined) {
          const isUSD = group.key === 'usa'
          return { ...item, price: formatPrice(matchedPrice, isUSD) }
        }
        return item
      }),
    }))
  }, [priceMap])

  const pageTitle = 'Pricing - Volks & David'
  const pageDesc = 'Transparent pricing for all Volks & David services. Income tax returns, NTN registration, GST, business services, and USA services.'
  const pageUrl = 'https://volksanddavid.com/pricing'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://volksanddavid.com/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Volks & David Services',
            description: 'Tax filing, NTN registration, GST compliance, business registration, and USA services.',
            brand: { '@type': 'Brand', name: 'Volks & David' },
            offers: services.flatMap((g) =>
              g.items.map((item) => ({
                '@type': 'Offer',
                name: item.service,
                price: item.price.replace(/[^0-9]/g, ''),
                priceCurrency: g.key === 'usa' ? 'USD' : 'PKR',
                availability: 'https://schema.org/InStock',
                url: pageUrl,
              }))
            ),
          })}
        </script>
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Transparent, affordable pricing for all our services. No hidden fees, no surprises.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {services.map((group) => (
                <motion.div key={group.category} variants={groupVariants}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <group.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{group.category}</h2>
                  </div>
                  <div className="rounded-xl border bg-card overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-semibold text-sm">Service</th>
                          <th className="text-right p-4 font-semibold text-sm w-48">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <motion.tr
                            key={item.service}
                            variants={rowVariants}
                            transition={{ delay: idx * 0.03 }}
                            className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm">{item.service}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <Badge variant="secondary" className="font-mono text-sm">
                                {item.price}
                              </Badge>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We offer tailored solutions for businesses and individuals with specific requirements. Get in touch for a personalized quote.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
