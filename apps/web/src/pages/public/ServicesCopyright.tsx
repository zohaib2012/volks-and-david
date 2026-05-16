import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, Copyright as CopyrightIcon, BookOpen, Music, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: CopyrightIcon,
    title: 'Lifetime Protection',
    description: 'Copyright protection lasts for the lifetime of the author plus 50 years, ensuring long-term rights over your work.',
  },
  {
    icon: BookOpen,
    title: 'Covers All Works',
    description: 'Protection for literary, artistic, musical, dramatic, cinematographic, and software works.',
  },
  {
    icon: Music,
    title: 'Creative Rights',
    description: 'Get exclusive rights to reproduce, distribute, perform, display, and create derivative works from your creation.',
  },
  {
    icon: Code,
    title: 'Software Protection',
    description: 'Copyright is the primary form of protection for software code, databases, and digital content.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Work Assessment',
    description: 'We assess your work and determine the appropriate category and registration requirements.',
  },
  {
    step: '02',
    title: 'Document Preparation',
    description: 'We prepare the copyright application form, statement of particulars, and compile all supporting materials.',
  },
  {
    step: '03',
    title: 'Submission to Copyright Office',
    description: 'We submit the complete application to the Copyright Office of Pakistan and handle all correspondence.',
  },
  {
    step: '04',
    title: 'Certificate Issuance',
    description: 'Once examined and approved, we deliver your copyright registration certificate.',
  },
]

const faqs = [
  {
    q: 'What types of works can be copyrighted?',
    a: 'Literary works (books, articles), artistic works (paintings, sculptures), musical works, cinematographic films, sound recordings, software code, and databases are all eligible for copyright registration.',
  },
  {
    q: 'How long does copyright registration take?',
    a: 'Copyright registration in Pakistan typically takes 6-12 months from application submission to certificate issuance.',
  },
  {
    q: 'Is copyright registration mandatory for protection?',
    a: 'In Pakistan, copyright exists automatically upon creation. However, registration provides a public record and is necessary for legal enforcement and disputes.',
  },
  {
    q: 'Can I copyright software and mobile apps?',
    a: 'Yes, software code, mobile applications, and databases are protected as literary works under Pakistani copyright law.',
  },
]

export default function ServicesCopyright() {
  return (
    <>
      <Helmet>
        <title>Copyright Registration Services - Volks & David</title>
        <meta name="description" content="Register your copyright with the Copyright Office of Pakistan. Protect literary, artistic, musical, and software works." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-purple-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <CopyrightIcon className="h-8 w-8 text-purple-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Copyright Registration
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Register your original creative works with the Copyright Office of Pakistan.
                Protect your literary, artistic, musical, cinematographic, and software works.
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
            <h2 className="text-3xl font-bold mb-3">Why Register Copyright?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Secure legal protection for your creative and intellectual works.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-purple-500" />
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
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From assessment to certificate in four steps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mb-4"
                      style={{ backgroundColor: 'rgb(139 92 246)', color: 'white' }}>
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-muted-foreground/30">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Pricing</h2>
              <p className="text-muted-foreground">Affordable copyright registration for all types of creative works.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Literary / Artistic</h3>
                  <div className="text-3xl font-bold text-purple-500 mb-4">PKR 10,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Application preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Document compilation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Copyright Office filing</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Certificate delivery</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-purple-500">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Software / Digital</h3>
                  <div className="text-3xl font-bold text-purple-500 mb-4">PKR 15,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Source code assessment</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Complete application filing</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Examination follow-up</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Priority handling</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Creative Work?</h2>
            <p className="text-muted-foreground mb-8">
              Register your copyright today and secure exclusive rights to your creation.
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
