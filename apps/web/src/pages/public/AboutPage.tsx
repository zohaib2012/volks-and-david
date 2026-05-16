import { Helmet } from 'react-helmet-async'
import { Shield, Users, Award, TrendingUp, Building, Globe } from 'lucide-react'

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Clients' },
  { icon: Award, value: '8+', label: 'Years Experience' },
  { icon: TrendingUp, value: '25,000+', label: 'Tax Returns Filed' },
  { icon: Building, value: '500+', label: 'Business Clients' },
]

const values = [
  {
    icon: Shield,
    title: 'Trust & Integrity',
    description: 'We uphold the highest standards of honesty and transparency in every engagement.',
  },
  {
    icon: Users,
    title: 'Client First',
    description: 'Your financial well-being is at the heart of everything we do.',
  },
  {
    icon: Globe,
    title: 'Innovation',
    description: 'Leveraging technology to simplify complex tax and financial processes.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Delivering premium quality service with meticulous attention to detail.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - Volks & David</title>
        <meta name="description" content="Learn about Volks & David - Pakistan's leading tax filing and financial services platform. Our mission, values, and team." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Volks & David</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Pakistan's premier tax filing and financial services platform, dedicated to making tax compliance simple, accessible, and affordable for everyone.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl border bg-card">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              At Volks & David, we believe that tax filing should not be a burden. Our mission is to 
              democratize access to professional tax and financial services across Pakistan. We combine 
              deep domain expertise with cutting-edge technology to deliver a seamless experience — from 
              income tax returns and NTN registration to GST compliance and business setup. We are 
              committed to empowering individuals and businesses with the tools and guidance they need 
              to achieve financial confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="p-6 rounded-xl border bg-card">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in Lahore with a vision to revolutionize the tax filing landscape in Pakistan, 
                Volks & David started as a small consultancy serving freelancers and small businesses. 
                Recognizing the pain points of complex paperwork, long queues, and lack of transparency, 
                we set out to build a digital-first platform that combines expert human guidance with 
                powerful technology.
              </p>
              <p>
                Over the years, we have grown into a trusted partner for thousands of individuals, 
                startups, SMEs, and large enterprises across the country. Our team of certified tax 
                professionals, chartered accountants, and software engineers work tirelessly to ensure 
                that every client's financial matters are handled with the utmost care and precision.
              </p>
              <p>
                Today, Volks & David is recognized as one of Pakistan's most trusted financial services 
                platforms — SECP registered, FBR partnered, and loved by over 10,000 clients nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
