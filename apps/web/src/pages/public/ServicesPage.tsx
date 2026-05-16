import { Helmet } from 'react-helmet-async'
import {
  FileText,
  UserCheck,
  Receipt,
  Percent,
  Briefcase,
  MessageCircle,
  Globe,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: FileText,
    title: 'Income Tax Returns',
    description:
      'Professional filing of annual income tax returns for salaried individuals, business owners, freelancers, AOPs, and companies. We ensure accurate computation and maximum legal savings.',
    features: [
      'Salaried individuals tax filing',
      'Business & self-employed returns',
      'Freelancer tax compliance',
      'AOP & Company tax returns',
      'Previous year filings',
    ],
    link: '/pricing',
  },
  {
    icon: UserCheck,
    title: 'NTN Registration',
    description:
      'Hassle-free National Tax Number registration with FBR. We handle the complete process from document preparation to certificate delivery.',
    features: [
      'New NTN registration',
      'NTN for freelancers',
      'NTN for businesses',
      'NTN certificate retrieval',
      'Profile amendments',
    ],
    link: '/pricing',
  },
  {
    icon: Receipt,
    title: 'GST Registration & Filing',
    description:
      'Complete Sales Tax / GST registration and monthly return filing services. Stay compliant with FBR regulations effortlessly.',
    features: [
      'GST registration (STRN)',
      'Monthly sales tax returns',
      'GST invoicing setup',
      'Sales tax notices handling',
      'Input tax adjustment advisory',
    ],
    link: '/sales-tax',
  },
  {
    icon: Percent,
    title: 'Withholding Tax',
    description:
      'Comprehensive withholding tax management including WHT statements, certificates, and compliance for businesses and contractors.',
    features: [
      'WHT statement preparation',
      'Monthly withholding returns',
      'WHT certificates issuance',
      'Exemptions & adjustments',
      'FBR compliance support',
    ],
    link: '/pricing',
  },
  {
    icon: Briefcase,
    title: 'Business & Legal Services',
    description:
      'End-to-end business registration and legal compliance services including SECP registration, trademark, copyright, and patent filing.',
    features: [
      'SECP company registration',
      'Trademark registration',
      'Copyright registration',
      'Patent filing',
      'Business compliance advisory',
    ],
    link: '/business-services',
  },
  {
    icon: MessageCircle,
    title: 'Consultations',
    description:
      'Expert tax and financial consultations via chat, call, email, or video conference. Get personalized advice from certified professionals.',
    features: [
      'Tax planning consultation',
      'Business financial advisory',
      'Investment tax implications',
      'Real estate tax advisory',
      'International tax queries',
    ],
    link: '/pricing',
  },
  {
    icon: Globe,
    title: 'USA Services',
    description:
      'Complete USA business setup services for Pakistani entrepreneurs and investors. LLC formation, EIN, ITIN, and bank account opening.',
    features: [
      'LLC formation in USA',
      'EIN registration',
      'ITIN application',
      'US bank account opening',
      'Complete setup packages',
    ],
    link: '/usa-services',
  },
]

const pageUrl = 'https://volksanddavid.com/services'
const title = 'Our Services - Volks & David'
const desc =
  'Explore all services offered by Volks & David - Income Tax Returns, NTN Registration, GST, Business Services, USA Services and more.'

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Volks & David Services',
  description: desc,
  provider: {
    '@type': 'LocalBusiness',
    name: 'Volks & David',
    url: 'https://volksanddavid.com',
  },
  areaServed: 'PK',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tax & Business Services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.description },
    })),
  },
}

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://volksanddavid.com/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />

        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tax, business, and financial services tailored for individuals and enterprises across Pakistan.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container space-y-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="grid md:grid-cols-5 gap-8 p-8 rounded-2xl border bg-card"
            >
              <div className="md:col-span-2">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                <Button asChild className="mt-4">
                  <Link to={service.link}>
                    View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  What We Offer
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
