import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MessageCircle, ArrowRight, Star,
  ShieldCheck, Building2, Clock, FileCheck, TrendingUp, Zap,
  Quote as QuoteIcon, Mail, Sparkles, Globe, ChevronRight,
} from 'lucide-react'

import HeroSection from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import ServicesSection from '@/components/landing/ServicesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import PricingSection from '@/components/landing/PricingSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import BlogPreviewSection from '@/components/landing/BlogPreviewSection'
import FAQSection from '@/components/landing/FAQSection'
import TrustBadgesSection from '@/components/landing/TrustBadgesSection'
import CTASection from '@/components/landing/CTASection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const pageUrl = 'https://volksanddavid.com'

/* ─── USA Services Highlight Section ─── */
const usaServices = [
  { title: 'LLC Formation', desc: 'Register your US company from Pakistan — 100% online', price: 'From $399', icon: Building2 },
  { title: 'EIN Application', desc: 'Employer Identification Number for your US business', price: 'From $99', icon: FileCheck },
  { title: 'ITIN Application', desc: 'Individual Taxpayer Identification Number for non-residents', price: 'From $199', icon: ShieldCheck },
  { title: 'US Bank Account', desc: 'Open a US bank account remotely for your business', price: 'From $0', icon: TrendingUp },
]

function USAServicesHighlightSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0D1F3C 50%, #0A1628 100%)' }} />
      <div className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #21346E 0%, transparent 55%)' }} />
      <div className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 70% 60%, #C8952E 0%, transparent 55%)' }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: '#21346E', top: '5%', right: '20%' }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-60 h-60 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: '#C8952E', bottom: '15%', left: '10%' }}
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C8952E]/30 bg-[#C8952E]/10 px-4 py-1.5">
            <Globe className="h-3.5 w-3.5 text-[#C8952E]" />
            <span className="text-xs font-semibold text-[#C8952E]">USA SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Expand to the{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #3B5C9E, #C8952E)' }}>
              US Market
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Complete USA business setup services for Pakistani entrepreneurs, freelancers, and businesses.
            We handle everything from company formation to tax compliance.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {usaServices.map((service, i) => (
            <motion.div
              key={service.title}
              variants={staggerItem}
              className="group relative rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 80%, rgba(200,149,46,0.12), transparent 65%)' }} />
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(200,149,46,0.12)' }}>
                  <service.icon className="h-6 w-6 text-[#C8952E]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed flex-1 mb-4">{service.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm font-bold text-[#C8952E]">{service.price}</span>
                  <span className="text-xs text-white/30 group-hover:text-[#C8952E] transition-colors flex items-center gap-1">
                    Learn More <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/usa-services"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #C8952E 0%, #B8862B 100%)',
              boxShadow: '0 4px 24px rgba(200,149,46,0.3)',
            }}
          >
            Explore All USA Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Volks & David',
  image: '/volksanddavid.png',
  url: pageUrl,
  telephone: '+92 302 2999904',
  email: 'info@volksanddavid.com',
  description:
    "Pakistan's #1 Premium Tax Filing & Financial Services Platform. File your tax returns, register for NTN, GST, and more with expert assistance.",
  address: { '@type': 'PostalAddress', addressCountry: 'PK' },
  aggregateRating: {
    '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '5000', bestRating: '5',
  },
  priceRange: 'PKR 500 - USD 599',
  areaServed: 'PK',
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Tax & Financial Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Income Tax Return Filing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'NTN Registration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GST Registration & Filing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SECP Company Registration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Trademark Registration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'USA LLC Formation' } },
    ],
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── Floating WhatsApp Button ─── */
function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <motion.a
        href="https://wa.me/923022999904"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl"
        style={{ background: '#25D366' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground/90 px-3 py-1.5 text-xs font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          Chat with us
        </span>
        <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#25D366' }} />
      </motion.a>
    </div>
  )
}

/* ─── Trusted By / Client Logos ─── */
const clients = [
  { initials: 'HT', name: 'Hashim Traders', color: '#21346E' },
  { initials: 'ZF', name: 'Zaman Fabrics', color: '#C8952E' },
  { initials: 'KD', name: 'Karachi Digital', color: '#F59E0B' },
  { initials: 'AS', name: 'Arif & Sons', color: '#8B5CF6' },
  { initials: 'NL', name: 'Nova Logistics', color: '#06B6D4' },
  { initials: 'BF', name: 'BlueFin Capital', color: '#F97316' },
  { initials: 'RM', name: 'Royal Motors', color: '#EC4899' },
  { initials: 'IT', name: 'Islamabad Tech', color: '#6366F1' },
]

function TrustedBySection() {
  return (
    <section className="py-14 border-y border-border/40 bg-background/50 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by <span className="text-foreground font-bold">500+ Businesses</span> Across Pakistan
          </p>
        </motion.div>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex w-max gap-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...clients, ...clients].map((client, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-5 py-3 shrink-0 hover:border-border/80 transition-colors"
              >
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: client.color }}>
                  {client.initials}
                </div>
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{client.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Why Choose Us ─── */
const reasons = [
  { icon: ShieldCheck, title: 'FBR Registered', desc: 'Authorised tax intermediary by the Federal Board of Revenue, Pakistan', color: '#21346E' },
  { icon: Building2, title: 'SECP Partner', desc: 'Registered partner with Securities & Exchange Commission of Pakistan', color: '#C8952E' },
  { icon: Clock, title: '10+ Years Experience', desc: 'Serving individuals & businesses since 2014 with excellence', color: '#3B5C9E' },
  { icon: FileCheck, title: '5000+ Returns Filed', desc: 'Thousands of satisfied clients across all major Pakistani cities', color: '#2C4182' },
  { icon: TrendingUp, title: '98% Success Rate', desc: 'Industry-leading success rate for all tax & business filings', color: '#D4A84B' },
  { icon: Zap, title: 'Same Day Service', desc: 'Most services completed within 24 hours — guaranteed turnaround', color: '#B8862B' },
]

function WhyChooseUsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(160 84% 39%), transparent)' }} />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="premium" className="px-4 py-1 text-xs">Why Choose Us</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            The{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #21346E, #C8952E)' }}>
              ProFit
            </span>{' '}
            Difference
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            We combine deep expertise with modern technology to deliver unmatched tax & business services.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={staggerItem}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 20%, ${reason.color}12, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: `${reason.color}18` }}>
                  <reason.icon className="h-6 w-6" style={{ color: reason.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Case Studies / Success Stories ─── */
const caseStudies = [
  {
    quote: 'Volks & David restructured our entire tax setup from the ground up. We saved over Rs. 2.5M in our first year — far beyond what we anticipated.',
    metric: 'Rs. 2.5M', metricLabel: 'Tax Savings in Year 1', industry: 'SaaS / Technology', tag: 'Tax Planning', accent: '#21346E',
    author: 'Usman Tariq', designation: 'CEO, NexaLabs Pvt. Ltd.',
  },
  {
    quote: 'We had a hard deadline for our SECP registration. Volks & David delivered the incorporation certificate within 24 hours — when every other firm said it would take a week.',
    metric: '24 Hours', metricLabel: 'SECP Turnaround', industry: 'E-Commerce', tag: 'Business Setup', accent: '#C8952E',
    author: 'Hira Mahmood', designation: 'Founder, ShopEase.pk',
  },
  {
    quote: 'The team managed every stage of our trademark filing — from submission to responding to examiner objections — without us having to lift a finger. Registered in 60 days flat.',
    metric: '60 Days', metricLabel: 'Trademark Registered', industry: 'Retail / Consumer Goods', tag: 'IP Protection', accent: '#8B5CF6',
    author: 'Bilal Cheema', designation: 'Director, Cheema Industries',
  },
]

function CaseStudiesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #F0F2F8, #F5F6FA 50%, #F0F2F8)' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #21346E 0%, transparent 50%), radial-gradient(circle at 75% 50%, #C8952E 0%, transparent 50%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="success" className="px-4 py-1 text-xs">Success Stories</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Real Results,{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #21346E, #C8952E)' }}>
              Real Impact
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            See how we&apos;ve helped businesses across Pakistan achieve outstanding financial outcomes.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {caseStudies.map((cs) => (
            <motion.div
              key={cs.metric}
              variants={staggerItem}
              className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 opacity-40 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${cs.accent}12, transparent 60%)` }} />
              <div className="relative z-10 p-7 flex flex-col h-full">
                <QuoteIcon className="h-6 w-6 mb-3 opacity-30" style={{ color: cs.accent }} />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 italic">
                  &ldquo;{cs.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: cs.accent }}>
                    {cs.author.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{cs.author}</p>
                    <p className="text-[11px] text-muted-foreground/70">{cs.designation}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-black" style={{ color: cs.accent }}>{cs.metric}</p>
                  <p className="text-xs text-muted-foreground font-medium">{cs.metricLabel}</p>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/40">
                  <Badge variant="info" className="text-[10px] px-2 py-0.5">{cs.tag}</Badge>
                  <span className="text-[11px] text-muted-foreground/60">{cs.industry}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" className="rounded-full border-border/60" asChild>
            <Link to="/case-studies">
              View All Case Studies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Email CTA Section ─── */
function EmailCTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#030B1A]" />
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 40%, #21346E, transparent 55%)' }} />
      <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 70% 60%, #C8952E, transparent 55%)' }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#21346E', top: '10%', right: '15%' }}
        animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#C8952E', bottom: '15%', left: '10%' }}
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="space-y-5">
            <Badge variant="premium" className="px-4 py-1 text-xs border-[#C8952E]/30 text-[#C8952E] bg-[#C8952E]/10">
              <Sparkles className="h-3 w-3 mr-1" />
              Get Started Today
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Ready to Get{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #3B5C9E, #C8952E)' }}>
                Started?
              </span>
            </h2>
            <p className="text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
              Join 500,000+ Pakistanis who trust us for their tax & business needs.
              Start your journey today &mdash; it&apos;s free.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-14 pl-11 text-base bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:border-[#C8952E]/50"
                />
              </div>
              <Button
                size="lg"
                className="h-14 px-7 text-base font-bold text-white border-0 rounded-xl shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #C8952E 0%, #B8862B 100%)',
                  boxShadow: '0 8px 32px rgba(200, 149, 46, 0.4)',
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-white/30 mt-3">
              Free account. No credit card required. Join 500K+ Pakistanis.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-2">
            {[
              { icon: ShieldCheck, text: 'FBR Authorised' },
              { icon: Building2, text: 'SECP Registered' },
              { icon: Star, text: '4.8★ Rated' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-white/40">
                <Icon className="h-4 w-4 text-[#C8952E]" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Main Page ─── */
export default function HomePage() {
  const title = 'Volks & David - Premium Tax Filing & Financial Services'
  const desc = "Pakistan's #1 Premium Tax Filing & Financial Services Platform. File your tax returns, register for NTN, GST, and more with expert assistance."

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
        <meta property="og:image" content="/volksanddavid.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      <HeroSection />
      <StatsSection />
      <TrustedBySection />
      <ServicesSection />
      <WhyChooseUsSection />
      <CaseStudiesSection />
      <HowItWorksSection />
      <USAServicesHighlightSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FAQSection />
      <EmailCTASection />
      <TrustBadgesSection />
      <CTASection />

      <WhatsAppFloat />
    </>
  )
}
