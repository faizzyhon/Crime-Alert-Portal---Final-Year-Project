import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Crime Alert Portal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to report crimes and help authorities maintain law and order in Pakistan.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-primary">
                About Us
              </Link>
              <Link href="/contact" className="block hover:text-primary">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Emergency</h3>
            <div className="space-y-2 text-sm">
              <p>
                Police: <strong>15</strong>
              </p>
              <p>
                Emergency: <strong>1122</strong>
              </p>
              <p>
                Women Helpline: <strong>1043</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Crime Alert Portal Pakistan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
