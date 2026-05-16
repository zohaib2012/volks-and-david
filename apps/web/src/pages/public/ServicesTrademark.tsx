import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, Search, FileText, Globe, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Brand Protection',
    description: 'Secure exclusive rights to your brand name, logo, and slogan. Prevent others from using your trademark.',
  },
  {
    icon: Search,
    title: 'Availability Search',
    description: 'Comprehensive trademark search to ensure your mark is available before filing the application.',
  },
  {
    icon: Globe,
    title: 'International Classes',
    description: 'Expert advisory on selecting the right international classes for comprehensive protection across goods and services.',
  },
  {
    icon: Award,
    title: '10-Year Protection',
    description: 'Trademark registration is valid for 10 years and is renewable indefinitely, providing long-term brand security.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Trademark Search',
    description: 'We conduct a comprehensive search of the IPO-Pakistan database to check trademark availability.',
  },
  {
    step: '02',
    title: 'Application Filing',
    description: 'We prepare and file the trademark application with IPO-Pakistan including all required documents.',
  },
  {
    step: '03',
    title: 'Examination & Publication',
    description: 'IPO examines the application and publishes it in the Trademark Journal. We handle all responses.',
  },
  {
    step: '04',
    title: 'Registration Certificate',
    description: 'Once registered, we deliver your trademark certificate and provide renewal reminders.',
  },
]

const faqs = [
  {
    q: 'What can be registered as a trademark?',
    a: 'Brand names, logos, slogans, taglines, symbols, colors, sounds, and any distinctive mark that identifies your goods or services can be registered.',
  },
  {
    q: 'How long does trademark registration take?',
    a: 'The complete process takes 12-18 months in Pakistan. This includes examination, publication, opposition period, and registration.',
  },
  {
    q: 'Is trademark registration valid internationally?',
    a: 'Trademark protection is territorial. Registration with IPO-Pakistan protects your mark in Pakistan. For international protection, separate applications are needed in each country.',
  },
  {
    q: 'What happens after trademark registration?',
    a: 'You get exclusive rights to use the trademark for 10 years. The mark can be renewed indefinitely every 10 years. You can also license or sell your trademark.',
  },
]

export default function ServicesTrademark() {
  return (
    <>
      <Helmet>
        <title>Trademark Registration Services - Volks & David</title>
        <meta name="description" content="Register your trademark with IPO-Pakistan. Protect your brand name, logo, and slogan. Expert assistance with trademark search and filing." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-indigo-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Trademark Registration
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Protect your brand identity by registering your trademark with the Intellectual Property Organization of Pakistan.
                Comprehensive search, application filing, and registration support.
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
            <h2 className="text-3xl font-bold mb-3">Why Register a Trademark?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Secure your brand with legal protection through trademark registration.
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
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-indigo-500" />
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
              From trademark search to registration certificate.
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
                      style={{ backgroundColor: 'rgb(99 102 241)', color: 'white' }}>
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
              <p className="text-muted-foreground">Protect your brand with affordable trademark registration.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Single Class</h3>
                  <div className="text-3xl font-bold text-indigo-500 mb-4">PKR 12,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Trademark availability search</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Application preparation & filing</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> IPO examination response</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Registration certificate</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-indigo-500">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Multi Class</h3>
                  <div className="text-3xl font-bold text-indigo-500 mb-4">PKR 18,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Multi-class search & advisory</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Multi-class application filing</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Complete IPO prosecution</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Priority support</li>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Brand?</h2>
            <p className="text-muted-foreground mb-8">
              Register your trademark today and secure exclusive rights to your brand identity.
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
