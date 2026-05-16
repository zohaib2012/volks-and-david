import { Helmet } from 'react-helmet-async'
import { Building, FileText, CreditCard, Landmark, Package, Check, ArrowRight, Shield, DollarSign, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

const services = [
  {
    icon: Building,
    title: 'LLC Formation',
    price: 'USD 299',
    description:
      'Register a Limited Liability Company in your chosen US state. Includes state filing fees, registered agent service for 1 year, and digital documents.',
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
    description:
      'Get your Employer Identification Number from the IRS. Required for US bank accounts, tax filing, and hiring.',
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
    description:
      'Individual Taxpayer Identification Number for non-residents who need a US tax ID but are not eligible for an SSN.',
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
    title: 'US Bank Account Opening',
    price: 'USD 149',
    description:
      'Open a US business bank account remotely. Compatible with major US banks and fintech platforms.',
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
    description:
      'Everything you need to establish your US business presence. The complete package covers LLC, EIN, ITIN, and bank account.',
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
    icon: Shield,
    title: 'US Presence, No Visa Needed',
    description: 'Form your US entity entirely remotely without ever stepping foot in America.',
  },
  {
    icon: DollarSign,
    title: 'Access US Payment Systems',
    description: 'Get access to Stripe, PayPal US, and other payment processors restricted to US entities.',
  },
  {
    icon: Globe,
    title: 'Global Credibility',
    description: 'A US registered business enhances your credibility with international clients and partners.',
  },
]

export default function USAServicesPage() {
  return (
    <>
      <Helmet>
        <title>USA Services - Volks & David</title>
        <meta name="description" content="USA business services for Pakistani entrepreneurs - LLC formation, EIN registration, ITIN application, and US bank account opening." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">USA Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete US business setup solutions for Pakistani entrepreneurs and investors. From LLC formation to bank account opening.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 rounded-xl border bg-card text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {services.map((service) => (
              <div
                key={service.title}
                className={`relative rounded-2xl border bg-card p-6 transition-all hover:shadow-lg ${
                  service.bestValue ? 'ring-2 ring-primary lg:scale-105' : ''
                }`}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {service.bestValue ? 'Best Value' : 'Popular'}
                  </Badge>
                )}
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                <div className="text-3xl font-bold text-primary mb-4">{service.price}</div>
                <p className="text-sm text-muted-foreground mb-5">{service.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={service.bestValue ? 'default' : 'outline'} asChild>
                  <Link to="/contact">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[
                { step: '1', title: 'Choose Your Package', desc: 'Select the service or package that fits your needs.' },
                { step: '2', title: 'Submit Documents', desc: 'Upload your documents through our secure portal.' },
                { step: '3', title: 'We Handle the Rest', desc: 'Our team processes everything and keeps you updated.' },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-xl border bg-card">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
