"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Content */}
      <div className="relative z-10 container text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Report Crimes. Save Lives. <span className="text-primary">Stand Against Injustice</span> in Pakistan.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Help local authorities take swift action by reporting criminal activities. Your report can make a
            difference.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Report a Crime Now
              </Button>
            </Link>
          )}
          <Link href="/about">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground">Available Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">Anonymous</div>
            <div className="text-muted-foreground">Reporting Option</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">Swift</div>
            <div className="text-muted-foreground">Authority Response</div>
          </div>
        </div>
      </div>
    </section>
  )
}
