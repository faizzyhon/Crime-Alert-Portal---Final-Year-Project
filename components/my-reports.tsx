"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import type { CrimeReport } from "@/lib/types"
import { format } from "date-fns"
import { Eye, MapPin, Calendar, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MyReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<CrimeReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [user])

  const fetchReports = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("crime_reports")
        .select(`
          *,
          admin_responses (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in_progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading your reports...</div>
        </CardContent>
      </Card>
    )
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">You haven't submitted any reports yet.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Reports</h2>
        <Badge variant="outline">{reports.length} Total Reports</Badge>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{report.crime_type}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(report.created_at), "MMM dd, yyyy")}
                    </span>
                    {report.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {report.location}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(report.status)}>{getStatusText(report.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{report.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {report.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
                  {report.admin_responses && report.admin_responses.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {report.admin_responses.length} Response(s)
                    </Badge>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{report.crime_type}</DialogTitle>
                      <DialogDescription>
                        Report submitted on {format(new Date(report.created_at), "MMMM dd, yyyy at hh:mm a")}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm">{report.description}</p>
                      </div>

                      {report.location && (
                        <div>
                          <h4 className="font-semibold mb-2">Location</h4>
                          <p className="text-sm">{report.location}</p>
                        </div>
                      )}

                      {report.image_url && (
                        <div>
                          <h4 className="font-semibold mb-2">Attached Image</h4>
                          <img
                            src={report.image_url || "/placeholder.svg"}
                            alt="Crime report evidence"
                            className="max-w-full h-auto rounded-lg"
                          />
                        </div>
                      )}

                      {report.video_link && (
                        <div>
                          <h4 className="font-semibold mb-2">Video Link</h4>
                          <a
                            href={report.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {report.video_link}
                          </a>
                        </div>
                      )}

                      {report.admin_responses && report.admin_responses.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Admin Responses</h4>
                          <div className="space-y-2">
                            {report.admin_responses.map((response) => (
                              <div key={response.id} className="bg-muted p-3 rounded-lg">
                                <p className="text-sm">{response.response}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(response.created_at), "MMM dd, yyyy at hh:mm a")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
