import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, Instagram, Youtube, MessageCircle, Send, ArrowRight } from "lucide-react"

const footerLinks = {
  Services: [
    { label: "Tax Return Filing", path: "/services" },
    { label: "NTN Registration", path: "/services" },
    { label: "GST Registration", path: "/services" },
    { label: "USA Services", path: "/usa-services" },
    { label: "Business Services", path: "/business-services" },
    { label: "Pricing", path: "/pricing" },
  ],
  Company: [
    { label: "About Us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Videos", path: "/videos" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" },
  ],
  Support: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Refund Policy", path: "/refund" },
    { label: "Help Center", path: "/faq" },
    { label: "Consultations", path: "/pricing" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/volksanddavid", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/volksanddavid", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/volksanddavid", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/volksanddavid", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@volksanddavid", label: "YouTube" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/volksanddavid-logo.svg" alt="Volks & David" className="h-9 w-auto" />
              <span className="text-xl font-bold">
                Volks <span className="text-primary">&</span> David
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Pakistan's #1 Premium Tax Filing & Financial Services Platform. FBR Authorised & SECP Registered.
            </p>

            {/* WhatsApp number */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: "#25D36620" }}>
                <MessageCircle className="h-4 w-4" style={{ color: "#25D366" }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <a href="https://wa.me/923022999904" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">
                  +92 302 2999904
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold mb-3">Stay Updated</p>
              <div className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 text-sm"
                />
                <Button size="icon" className="h-10 w-10 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group">
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 py-5 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Volks & David. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {["SECP Registered", "FBR Partner", "PCI Compliant"].map((badge) => (
              <span key={badge} className="text-xs px-3 py-1 rounded-full border border-border/60 bg-background/50">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
