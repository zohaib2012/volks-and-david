import { Helmet } from 'react-helmet-async'
import { Receipt, FileText, CheckCircle, AlertCircle, ArrowRight, Calendar, DollarSign, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

const highlights = [
  {
    icon: Building,
    title: 'GST Registration',
    price: 'PKR 3,000',
    desc: 'Complete STRN registration process handled end-to-end.',
  },
  {
    icon: FileText,
    title: 'Monthly Return Filing',
    price: 'PKR 1,500/mo',
    desc: 'On-time monthly sales tax return filing every month.',
  },
  {
    icon: Calendar,
    title: 'Quarterly Filing',
    price: 'PKR 3,000/qtr',
    desc: 'Quarterly returns for eligible businesses.',
  },
  {
    icon: AlertCircle,
    title: 'Notice Handling',
    price: 'PKR 5,000',
    desc: 'Professional response to FBR sales tax notices.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Submit Documents',
    desc: 'Provide CNIC, NTN, business registration, and bank details.',
  },
  {
    step: '02',
    title: 'Application Filing',
    desc: 'We prepare and submit your GST registration application to FBR.',
  },
  {
    step: '03',
    title: 'Verification',
    desc: 'FBR verifies your application and processes the registration.',
  },
  {
    step: '04',
    title: 'STRN Issued',
    desc: 'Receive your Sales Tax Registration Number (STRN) certificate.',
  },
]

const faqs = [
  {
    q: 'What is the turnover threshold for GST registration?',
    a: 'Businesses with annual turnover exceeding PKR 10 million are required to register for GST in Pakistan.',
  },
  {
    q: 'What is the deadline for monthly sales tax returns?',
    a: 'Monthly sales tax returns must be filed by the 15th of the following month. Late filing can result in penalties.',
  },
  {
    q: 'Can I claim input tax?',
    a: 'Yes, registered taxpayers can claim input tax adjustments on purchases made for business purposes, subject to FBR rules.',
  },
  {
    q: 'What documents are needed for GST registration?',
    a: 'You need your CNIC, NTN certificate, business registration documents, bank account details, and proof of business address.',
  },
]

export default function SalesTaxPage() {
  return (
    <>
      <Helmet>
        <title>Sales Tax / GST Services - Volks & David</title>
        <meta name="description" content="Complete Sales Tax and GST services in Pakistan - registration, monthly return filing, notice handling, and compliance support." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sales Tax / GST Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            End-to-end sales tax compliance solutions — from GST registration to monthly return filing and notice handling.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {highlights.map((item) => (
              <div key={item.title} className="p-5 rounded-xl border bg-card">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <div className="text-xl font-bold text-primary mb-1">{item.price}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">What is GST / Sales Tax?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                General Sales Tax (GST) is a consumption tax levied on the supply of goods and services 
                in Pakistan. It is administered by the Federal Board of Revenue (FBR) and is a critical 
                component of the country's indirect taxation system.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Any business that meets the threshold criteria must register for GST, collect tax from 
                customers, and remit it to the government on a monthly basis. Non-compliance can result 
                in significant penalties and legal consequences.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Standard GST rate in Pakistan: <strong>18%</strong> (15% for certain services)
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Who Needs GST Registration?</h3>
              <ul className="space-y-3">
                {[
                  'Businesses with annual turnover exceeding PKR 10 million',
                  'Importers and exporters of goods',
                  'Service providers in taxable service categories',
                  'Manufacturers and retailers in the supply chain',
                  'E-commerce businesses meeting the threshold',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">Registration Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div key={step.step} className="relative p-6 rounded-xl border bg-card">
                  <div className="text-3xl font-bold text-primary/20 mb-2">{step.step}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Monthly Return Filing</h2>
            <div className="p-8 rounded-2xl border bg-card">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3">What We Handle</h3>
                  <ul className="space-y-2">
                    {[
                      'Preparation of monthly sales tax returns',
                      'Input tax adjustment calculations',
                      'Integration with FBR IRIS system',
                      'Timely submission before the 15th',
                      'Maintenance of proper sales & purchase records',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Penalties for Non-Compliance</h3>
                  <ul className="space-y-2">
                    {[
                      'Late filing: PKR 10,000 per return',
                      'Late payment: 1% per month on unpaid tax',
                      'Non-filing: Up to PKR 500,000 penalty',
                      'Wrongful input claim: 100% penalty plus tax',
                      'Possible business suspension',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-xl border bg-card">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/contact">
                Get GST Assistance <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
