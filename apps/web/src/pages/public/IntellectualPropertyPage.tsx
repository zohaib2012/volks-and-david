import { Helmet } from 'react-helmet-async'
import { Shield, Copyright, Lightbulb, Check, ArrowRight, BookOpen, Award, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const services = [
  {
    icon: Shield,
    title: 'Trademark Registration',
    price: 'PKR 12,000',
    description:
      'Protect your brand identity by registering your trademark with the Intellectual Property Organization of Pakistan (IPO-Pakistan).',
    features: [
      'Comprehensive trademark availability search',
      'International class selection advisory',
      'Application drafting and filing with IPO',
      'Examination response and follow-up',
      'Publication monitoring and opposition handling',
      'Registration certificate collection',
    ],
    timeline: '12-18 months',
    protection: '10 years (renewable)',
  },
  {
    icon: Copyright,
    title: 'Copyright Registration',
    price: 'PKR 10,000',
    description:
      'Register your original creative works with the Copyright Office of Pakistan. Covers literary, artistic, musical, cinematographic, and software works.',
    features: [
      'Work categorization and eligibility assessment',
      'Application form preparation',
      'Supporting document compilation',
      'Submission to Copyright Office',
      'Examination follow-up and correspondence',
      'Registration certificate issuance',
    ],
    timeline: '6-12 months',
    protection: 'Lifetime + 50 years',
  },
  {
    icon: Lightbulb,
    title: 'Patent Registration',
    price: 'PKR 25,000',
    description:
      'File patents for your inventions with IPO-Pakistan. Protection for new and useful processes, machines, articles of manufacture, or compositions of matter.',
    features: [
      'Patentability assessment and prior art search',
      'Patent specification drafting',
      'Claims preparation and optimization',
      'IPO filing and prosecution',
      'Examination report responses',
      'Patent grant and maintenance assistance',
    ],
    timeline: '24-36 months',
    protection: '20 years',
  },
]

const whyIPO = [
  {
    icon: Award,
    title: 'Government Authority',
    desc: 'IPO-Pakistan is the official government body responsible for intellectual property rights in Pakistan.',
  },
  {
    icon: Globe,
    title: 'International Recognition',
    desc: 'IPO-Pakistan is a member of WIPO, ensuring international recognition of registered IP rights.',
  },
  {
    icon: BookOpen,
    title: 'Legal Framework',
    desc: 'IP registration in Pakistan is governed by comprehensive laws including the Trademarks Ordinance 2001, Copyright Ordinance 1962, and Patents Ordinance 2000.',
  },
]

export default function IntellectualPropertyPage() {
  return (
    <>
      <Helmet>
        <title>Intellectual Property Services - Volks & David</title>
        <meta name="description" content="IP services in Pakistan - trademark, copyright, and patent registration with IPO-Pakistan. Protect your intellectual property with expert assistance." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Intellectual Property Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Protect your innovations, brand, and creative works. Comprehensive IP registration services through IPO-Pakistan.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {whyIPO.map((item) => (
              <div key={item.title} className="p-6 rounded-xl border bg-card text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
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
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>Timeline: {service.timeline}</p>
                    <p>Protection: {service.protection}</p>
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
                    Service Includes
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

          <div className="mt-16 p-8 rounded-2xl border bg-muted/30">
            <h2 className="text-2xl font-bold text-center mb-6">Why Register Your IP?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: 'Exclusive Rights',
                  desc: 'Get exclusive legal rights to use, license, and enforce your intellectual property.',
                },
                {
                  title: 'Asset Value',
                  desc: 'IP assets can be valued, sold, licensed, or used as collateral for financing.',
                },
                {
                  title: 'Competitive Edge',
                  desc: 'Prevent competitors from using your brand, inventions, or creative works without permission.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border bg-card text-center">
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
