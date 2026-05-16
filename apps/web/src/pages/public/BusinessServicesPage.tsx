import { Helmet } from 'react-helmet-async'
import { Building2, Shield, Copyright, Lightbulb, Check, ArrowRight, FileText, Scale, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const services = [
  {
    icon: Building2,
    title: 'SECP Company Registration',
    price: 'PKR 15,000',
    description:
      'Register your company with the Securities and Exchange Commission of Pakistan. We handle the entire process from name reservation to certificate issuance.',
    features: [
      'Company name reservation',
      'Form 1 & 2 preparation',
      'Memorandum & Articles of Association',
      'NTN & STRN registration',
      'Digital certificate delivery',
    ],
    timeline: '3-7 business days',
  },
  {
    icon: Shield,
    title: 'Trademark Registration',
    price: 'PKR 12,000',
    description:
      'Protect your brand identity by registering your trademark with IPO-Pakistan. Comprehensive search and application filing included.',
    features: [
      'Trademark availability search',
      'Class selection advisory',
      'Application drafting & filing',
      'IPO correspondence handling',
      'Registration certificate',
    ],
    timeline: '12-18 months',
  },
  {
    icon: Copyright,
    title: 'Copyright Registration',
    price: 'PKR 10,000',
    description:
      'Register your original creative works with the Copyright Office of Pakistan. Protect your literary, artistic, musical, and software works.',
    features: [
      'Work categorization',
      'Application preparation',
      'Submission to Copyright Office',
      'Examination follow-up',
      'Registration certificate',
    ],
    timeline: '6-12 months',
  },
  {
    icon: Lightbulb,
    title: 'Patent Registration',
    price: 'PKR 25,000',
    description:
      'File patents for your inventions with IPO-Pakistan. Protection for new and useful processes, machines, manufactures, or compositions of matter.',
    features: [
      'Patentability assessment',
      'Specification drafting',
      'Claims preparation',
      'IPO filing & prosecution',
      'Patent grant assistance',
    ],
    timeline: '24-36 months',
  },
]

const benefits = [
  {
    icon: Scale,
    title: 'Legal Protection',
    description: 'Safeguard your business and intellectual property with proper legal registration.',
  },
  {
    icon: FileText,
    title: 'Full Documentation',
    description: 'Complete document preparation and filing with relevant government authorities.',
  },
  {
    icon: Shield,
    title: 'Expert Guidance',
    description: 'Professional advice at every step of the registration process.',
  },
]

export default function BusinessServicesPage() {
  const BenefitIcon = benefits[2].icon

  return (
    <>
      <Helmet>
        <title>Business Services - Volks & David</title>
        <meta name="description" content="Business registration and legal services in Pakistan - SECP registration, trademark, copyright, and patent filing services." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Business & Legal Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive business registration and intellectual property protection services in Pakistan.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-xl border bg-card text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Legal Protection</h3>
              <p className="text-sm text-muted-foreground">Safeguard your business and intellectual property with proper legal registration.</p>
            </div>
            <div className="p-6 rounded-xl border bg-card text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Full Documentation</h3>
              <p className="text-sm text-muted-foreground">Complete document preparation and filing with relevant government authorities.</p>
            </div>
            <div className="p-6 rounded-xl border bg-card text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">Professional advice at every step of the registration process.</p>
            </div>
          </div>

          <div className="space-y-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="grid md:grid-cols-5 gap-6 p-8 rounded-2xl border bg-card"
              >
                <div className="md:col-span-2">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                  <div className="text-3xl font-bold text-primary mb-2">{service.price}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <ClockIcon />
                    <span>Timeline: {service.timeline}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  <Button asChild className="mt-4">
                    <Link to="/contact">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                    What's Included
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
