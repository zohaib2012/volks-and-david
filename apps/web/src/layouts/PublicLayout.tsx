import { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { Phone, MessageCircle } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import LeadCaptureForm from "@/components/landing/LeadCaptureForm"
import ExitIntentPopup from "@/components/landing/ExitIntentPopup"
import { Button } from "@/components/ui/button"

export default function PublicLayout() {
  const [leadFormOpen, setLeadFormOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      <ExitIntentPopup />

      <LeadCaptureForm open={leadFormOpen} onOpenChange={setLeadFormOpen} />

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden safe-area-bottom">
        <div className="flex items-center gap-2 px-4 py-3">
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg"
            onClick={() => setLeadFormOpen(true)}
          >
            Get Free Consultation
          </Button>
          <a
            href="https://wa.me/923022999904"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="tel:+923022999904"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Call us"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
