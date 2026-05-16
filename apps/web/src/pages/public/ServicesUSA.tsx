import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, Building, FileText, CreditCard, Landmark, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const packages = [
  {
    icon: Building,
    title: 'LLC Formation',
    price: 'USD 299',
    description: 'Register a Limited Liability Company in your chosen US state. Includes state filing fees and registered agent service.',
    features: [
      'State filing & Articles of Organization',
      'Registered agent for 1 year',
      'Digital formation documents',
      'Operating agreement template',
      'EIN application guidance',
    ],
    popular: true,
  },
  {
    icon: FileText,
    title: 'EIN Registration',
    price: 'USD 99',
    description: 'Get your Employer Identification Number from the IRS. Required for US bank accounts and tax filing.',
    features: [
      'IRS Form SS-4 preparation',
      'EIN application submission',
      'EIN confirmation letter',
      'Same-day processing',
      'Lifetime support',
    ],
    popular: false,
  },
  {
    icon: CreditCard,
    title: 'ITIN Application',
    price: 'USD 199',
    description: 'Individual Taxpayer Identification Number for non-residents who need a US tax ID but are not eligible for an SSN.',
    features: [
      'Form W-7 preparation',
      'Passport certification support',
      'Application review & submission',
      'IRS correspondence handling',
      'Status tracking',
    ],
    popular: false,
  },
  {
    icon: Landmark,
    title: 'US Bank Account',
    price: 'USD 149',
    description: 'Open a US business bank account remotely. Compatible with major US banks and fintech platforms.',
    features: [
      'Bank selection advisory',
      'Document preparation',
      'Application assistance',
      'Account verification support',
      'Debit card mailing',
    ],
    popular: false,
  },
  {
    icon: Package,
    title: 'Complete USA Package',
    price: 'USD 599',
    description: 'Everything you need to establish your US business presence. LLC, EIN, ITIN, and bank account.',
    features: [
      'LLC formation in any state',
      'EIN registration',
      'ITIN application',
      'US bank account opening',
      'Registered agent (1 year)',
      'Operating agreement',
      'Priority support',
    ],
    popular: true,
    bestValue: true,
  },
]

const benefits = [
  {
    icon: ShieldCheck,
    title: 'US Presence, No Visa Needed',
    description: 'Form your US entity entirely remotely without ever stepping foot in America.',
  },
  {
    icon: CreditCard,
    title: 'Access US Payment Systems',
    description: 'Get access to Stripe, PayPal US, and other payment processors restricted to US entities.',
  },
  {
    icon: Building,
    title: 'Global Credibility',
    description: 'A US registered business enhances your credibility with international clients and partners.',
  },
]

const steps = [
  { step: '1', title: 'Choose Your Package', desc: 'Select the service or package that fits your needs.' },
  { step: '2', title: 'Submit Documents', desc: 'Upload your documents through our secure portal.' },
  { step: '3', title: 'We Handle the Rest', desc: 'Our team processes everything and keeps you updated.' },
]

const faqs = [
  {
    q: 'Do I need to visit the US for LLC formation?',
    a: 'No, the entire process can be completed remotely. We handle everything online — from filing to bank account opening.',
  },
  {
    q: 'What documents do I need for LLC formation?',
    a: 'You need your passport (or CNIC for Pakistanis), proof of address, and basic personal information. No US visa or SSN is required.',
  },
  {
    q: 'How long does the complete USA setup take?',
    a: 'LLC formation takes 2-5 business days. EIN is issued same-day. ITIN takes 7-11 weeks. Bank account setup takes 1-2 weeks.',
  },
  {
    q: 'Can I open a US bank account without visiting the US?',
    a: 'Yes, we facilitate remote US bank account opening through partner banks and fintech platforms that accept remote verification.',
  },
]

export default function ServicesUSA() {
  return (
    <>
      <Helmet>
        <title>USA Business Services - Volks & David</title>
        <meta name="description" content="USA business setup for Pakistani entrepreneurs. LLC formation, EIN, ITIN, and US bank account opening. Complete remote process." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-rose-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-rose-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-rose-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-rose-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                USA Services
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Complete US business setup solutions for Pakistani entrepreneurs and investors.
                From LLC formation to bank account opening — entirely remote.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Set Up a US Business?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock global opportunities with a US-registered business.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-rose-500" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Services & Packages</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the service that fits your needs or go with the complete package.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.title}
                className={`relative rounded-2xl border bg-card p-6 transition-all hover:shadow-lg ${
                  pkg.bestValue ? 'ring-2 ring-rose-500 lg:scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                    {pkg.bestValue ? 'Best Value' : 'Popular'}
                  </Badge>
                )}
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                  <pkg.icon className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold mb-1">{pkg.title}</h3>
                <div className="text-3xl font-bold text-rose-500 mb-4">{pkg.price}</div>
                <p className="text-sm text-muted-foreground mb-5">{pkg.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={pkg.bestValue ? 'default' : 'outline'} asChild>
                  <Link to="/contact">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm mb-4">
                        {step.step}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Go Global?</h2>
            <p className="text-muted-foreground mb-8">
                Start your US business setup today. Entirely remote process.
              </p>
              <Button asChild size="lg">
                <Link to="/contact">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </>
    )
  }
