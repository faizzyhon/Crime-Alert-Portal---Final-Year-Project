"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ReportCrimeForm } from "@/components/report-crime-form"
import { MyReports } from "@/components/my-reports"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, Shield, Users } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Report crimes and track your submissions to help make Pakistan safer.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Report</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Emergency</div>
              <p className="text-xs text-muted-foreground">Call 15 for immediate help</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Protected</div>
              <p className="text-xs text-muted-foreground">Your identity is safe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24/7</div>
              <p className="text-xs text-muted-foreground">Authority monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Track</div>
              <p className="text-xs text-muted-foreground">Monitor your submissions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="report">Report a Crime</TabsTrigger>
            <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <ReportCrimeForm />
          </TabsContent>

          <TabsContent value="my-reports">
            <MyReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
