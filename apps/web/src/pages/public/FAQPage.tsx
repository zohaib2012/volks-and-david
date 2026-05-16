import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Accordion from '@radix-ui/react-accordion'

const categories = [
  { id: 'general', label: 'General' },
  { id: 'tax-returns', label: 'Tax Returns' },
  { id: 'ntn', label: 'NTN Registration' },
  { id: 'gst', label: 'GST / Sales Tax' },
  { id: 'business', label: 'Business Services' },
  { id: 'usa', label: 'USA Services' },
]

const faqs = [
  {
    category: 'general',
    qa: [
      {
        q: 'What is Volks & David?',
        a: 'Volks & David is Pakistan\'s premier tax filing and financial services platform. We help individuals and businesses with income tax returns, NTN registration, GST compliance, business registration, USA services, and more.',
      },
      {
        q: 'Is Volks & David registered with SECP?',
        a: 'Yes, Volks & David is a fully SECP-registered company operating in compliance with all applicable laws and regulations in Pakistan.',
      },
      {
        q: 'How can I contact customer support?',
        a: 'You can reach us via phone, email, or live chat. Visit our Contact page for detailed information. We typically respond within 24 hours.',
      },
    ],
  },
  {
    category: 'tax-returns',
    qa: [
      {
        q: 'Who needs to file an income tax return in Pakistan?',
        a: 'Any individual earning above PKR 600,000 annually, all business owners, AOPs, and companies registered in Pakistan must file income tax returns. Filing is also required if the FBR has issued a notice.',
      },
      {
        q: 'What is the deadline for filing tax returns?',
        a: 'For salaried individuals and AOPs, the deadline is September 30 each year. For companies, the deadline is December 31. Late filing attracts penalties.',
      },
      {
        q: 'What documents do I need to file my tax return?',
        a: 'You typically need your CNIC, NTN certificate, salary slips (Form 12), bank statements, property documents, vehicle documents, and investment certificates.',
      },
      {
        q: 'Can I file previous year tax returns?',
        a: 'Yes, we can help you file returns for previous tax years. Additional fees may apply for each previous year.',
      },
    ],
  },
  {
    category: 'ntn',
    qa: [
      {
        q: 'What is an NTN?',
        a: 'NTN (National Tax Number) is a unique identifier issued by the FBR to taxpayers in Pakistan. It is required for filing tax returns, conducting business, and various financial transactions.',
      },
      {
        q: 'How long does NTN registration take?',
        a: 'NTN registration typically takes 1-3 business days once all required documents are submitted. We expedite the process to ensure minimal delay.',
      },
      {
        q: 'Do freelancers need NTN?',
        a: 'Yes, freelancers earning taxable income in Pakistan are required to register for NTN and file annual tax returns. It is also often required by payment platforms and banks.',
      },
    ],
  },
  {
    category: 'gst',
    qa: [
      {
        q: 'Who needs GST registration?',
        a: 'Businesses with annual turnover exceeding PKR 10 million, importers, exporters, and certain service providers are required to register for GST.',
      },
      {
        q: 'What is STRN?',
        a: 'STRN (Sales Tax Registration Number) is the unique registration number issued by FBR to businesses registered for sales tax / GST.',
      },
      {
        q: 'How often do I need to file GST returns?',
        a: 'GST-registered businesses must file monthly sales tax returns by the 15th of each following month. Quarterly filing is available for certain categories.',
      },
    ],
  },
  {
    category: 'business',
    qa: [
      {
        q: 'What types of companies can be registered with SECP?',
        a: 'You can register Private Limited Companies, Single Member Companies, Public Limited Companies, and Associations of Persons (AOPs) with SECP.',
      },
      {
        q: 'How long does SECP registration take?',
        a: 'SECP company registration typically takes 3-7 business days, depending on the type of company and completeness of documentation.',
      },
      {
        q: 'What is the difference between trademark and copyright?',
        a: 'A trademark protects brand identifiers like logos, names, and slogans. Copyright protects original creative works like books, music, software, and artwork.',
      },
    ],
  },
  {
    category: 'usa',
    qa: [
      {
        q: 'Can Pakistani citizens form a US LLC?',
        a: 'Yes, Pakistani citizens can form a US LLC without needing a US visa or residency. You can do it entirely remotely through our services.',
      },
      {
        q: 'What is an EIN and why do I need it?',
        a: 'EIN (Employer Identification Number) is a federal tax ID issued by the IRS. It is required for opening US bank accounts, filing taxes, and hiring employees.',
      },
      {
        q: 'What is an ITIN?',
        a: 'ITIN (Individual Taxpayer Identification Number) is a tax processing number issued by the IRS for individuals who need a US taxpayer ID but are not eligible for an SSN.',
      },
    ],
  },
]

const pageUrl = 'https://volksanddavid.com/faq'
const title = 'Frequently Asked Questions - Volks & David'
const desc =
  'Find answers to frequently asked questions about tax filing, NTN registration, GST, business services, and USA services from Volks & David.'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((f) =>
    f.qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const activeFaqs = faqs.find((f) => f.category === activeCategory)?.qa || []

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

        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our services. Cannot find what you are looking for? Contact us.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Accordion.Root type="single" collapsible className="space-y-3">
            {activeFaqs.map((faq, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between p-5 text-left font-medium hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <div className="mt-12 text-center p-8 rounded-xl border bg-muted/30">
            <h2 className="text-lg font-semibold mb-2">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-4">
              We are happy to help. Reach out to our support team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
