import { Star, Quote } from "lucide-react"

interface Testimonial {
  quote: string
  name: string
  role: string
  rating: number
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    quote: "I was dreading tax season, but Volks & David made it effortless. Filed my return in 15 minutes and got my refund in record time.",
    name: "Ahmed Hassan",
    role: "Software Engineer, Lahore",
    rating: 5,
    avatar: "AH",
  },
  {
    quote: "Their NTN registration service saved me hours of running around. Everything was handled online and I had my certificate in 3 days.",
    name: "Fatima Riaz",
    role: "Freelancer, Karachi",
    rating: 5,
    avatar: "FR",
  },
  {
    quote: "As a business owner, I appreciate how thorough they are with compliance. They caught deductions I didn't even know existed.",
    name: "Omar Farooq",
    role: "Business Owner, Islamabad",
    rating: 5,
    avatar: "OF",
  },
  {
    quote: "The best part is the transparency. They tell you exactly what you need, what it costs, and deliver on time. Highly recommended!",
    name: "Zainab Ali",
    role: "Doctor, Rawalpindi",
    rating: 5,
    avatar: "ZA",
  },
  {
    quote: "Finally a tax platform that understands Pakistan's tax system. Their support team is incredibly helpful and responsive.",
    name: "Bilal Ahmed",
    role: "E-commerce Seller, Sialkot",
    rating: 5,
    avatar: "BA",
  },
  {
    quote: "From FBR notices to tax returns, they handle everything. I don't worry about taxes anymore thanks to Volks & David.",
    name: "Sana Malik",
    role: "Marketing Professional, Lahore",
    rating: 5,
    avatar: "SM",
  },
]

const avatarColors = [
  { bg: "rgba(79,111,245,0.15)", color: "#60A5FA" },
  { bg: "rgba(16,185,129,0.15)", color: "#34D399" },
  { bg: "rgba(245,158,11,0.15)", color: "#FBBF24" },
  { bg: "rgba(139,92,246,0.15)", color: "#A78BFA" },
  { bg: "rgba(244,63,94,0.15)", color: "#FB7185" },
  { bg: "rgba(6,182,212,0.15)", color: "#22D3EE" },
]

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  const colors = avatarColors[i % avatarColors.length]
  return (
    <div
      className="rounded-2xl border border-border/50 bg-card p-6 min-w-[320px] max-w-[340px] shrink-0 mx-3 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
        ))}
      </div>

      {/* Quote */}
      <div className="relative">
        <Quote className="absolute -top-1 -left-1 h-5 w-5 opacity-15" style={{ color: colors.color }} />
        <p className="text-sm leading-relaxed text-muted-foreground pl-4">&ldquo;{t.quote}&rdquo;</p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border/50">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: colors.bg, color: colors.color }}
        >
          {t.avatar}
        </div>
        <div>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />

      <div className="container relative z-10">
        <div className="text-center space-y-4 mb-14">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Client Stories</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Trusted by{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(228 88% 62%), hsl(160 84% 39%))" }}>
              50,000+ Clients
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Real stories from real people — see why Pakistan trusts Volks &amp; David.
          </p>
        </div>
      </div>

      {/* Scrolling testimonials — outside container for full bleed */}
      <div className="relative mt-4">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(220 25% 98%), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(220 25% 98%), transparent)" }} />

        <div className="flex animate-scroll">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} t={t} i={i % testimonials.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
