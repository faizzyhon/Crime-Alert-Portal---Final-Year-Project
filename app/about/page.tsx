import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, Code, Database, Palette, Globe } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Amna Naeem",
      rollNumber: "BSCS/FA21/505",
      role: "Project Lead & Frontend Developer",
    },
    {
      name: "Anamara Ghaffar",
      rollNumber: "BSCS/FA21/512",
      role: "Backend Developer & Database Designer",
    },
    {
      name: "Shamim Bibi",
      rollNumber: "BSCS/FA21/526",
      role: "UI/UX Designer & Quality Assurance",
    },
  ]

  const techStack = [
    {
      name: "Next.js",
      description: "For a fast, SEO-friendly, and server-side rendered application",
      icon: Globe,
    },
    {
      name: "TypeScript",
      description: "To ensure type safety and improve code quality",
      icon: Code,
    },
    {
      name: "Supabase",
      description: "For a robust backend with real-time database capabilities and authentication",
      icon: Database,
    },
    {
      name: "Tailwind CSS",
      description: "For a highly customizable and responsive design system",
      icon: Palette,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
          <div className="container">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <GraduationCap className="h-5 w-5 mr-2" />
                Final Year Project
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                About Our <span className="text-primary">Crime Alert Portal</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive web portal developed by Computer Science students to empower citizens and enhance
                community safety across Pakistan.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                Dedicated Computer Science students working together to make Pakistan safer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-sm font-mono">{member.rollNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
              <p className="text-lg text-muted-foreground">Modern technologies powering our Crime Alert Portal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map((tech, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <tech.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Academic Information</h2>
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Institution</h4>
                      <p className="text-muted-foreground">Sadiq College Women University Bahawalpur, Pakistan</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Program</h4>
                      <p className="text-muted-foreground">BS Computer Science</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Supervisor</h4>
                      <p className="text-muted-foreground">Dr. Shazana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
