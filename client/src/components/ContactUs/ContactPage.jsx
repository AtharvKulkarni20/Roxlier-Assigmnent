import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, ThumbsUp, Instagram, Facebook, Linkedin } from "lucide-react"

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    alert("Thanks for reaching out! We’ll get back to you soon.")
  }

  return (
    <main className="relative isolate">
      <div aria-hidden className="h-6 w-full " />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: intro and contact details */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif ">Get in Touch</h1>
            <p className="text-lg text-zinc-700">I&apos;d like to hear from you!</p>
            <p className="text-zinc-600">
              If you have any inquiries or just want to say hi, please use the contact form.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="mailto:hello@ratemate.app"
                className="inline-flex items-center gap-2  underline underline-offset-4"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                hello@ratemate.app
              </a>

              <div className="flex items-center gap-3 text-zinc-600">
                <ThumbsUp className="h-5 w-5" aria-hidden="true" />
                <div className="flex items-center gap-3">
                  <a href="#" aria-label="Instagram" className="hover:text-amber-900">
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a href="#" aria-label="Facebook" className="hover:text-amber-900">
                    <Facebook className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="hover:text-amber-900">
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="Jane" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="How can we help?" rows={6} required />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className=" text-white "
                aria-busy={submitting}
              >
                {submitting ? "Sending…" : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </section>
      <div aria-hidden className="h-6 w-full " />
    </main>
  )
}
