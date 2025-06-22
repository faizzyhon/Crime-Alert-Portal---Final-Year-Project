"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import type { CrimeReport } from "@/lib/types"
import { format } from "date-fns"
import { Eye, MessageSquare, MapPin, Calendar, Search, Filter } from "lucide-react"

export function AdminReports() {
  const [reports, setReports] = useState<CrimeReport[]>([])
  const [filteredReports, setFilteredReports] = useState<CrimeReport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null)
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.crime_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (report.location && report.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (report.user && report.user.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    if (crimeTypeFilter !== "all") {
      filtered = filtered.filter((report) => report.crime_type === crimeTypeFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, statusFilter, crimeTypeFilter])

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("crime_reports")
        .select(`
          *,
          users (
            name,
            cnic,
            phone,
            email
          ),
          admin_responses (*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      const reportsWithUsers = (data || []).map((report) => ({
        ...report,
        user: report.is_anonymous ? null : report.users,
      }))

      setReports(reportsWithUsers)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("crime_reports")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", reportId)

      if (error) throw error

      setReports((prev) =>
        prev.map((report) => (report.id === reportId ? { ...report, status: newStatus as any } : report)),
      )
    } catch (error) {
      console.error("Error updating report status:", error)
    }
  }

  const submitResponse = async () => {
    if (!selectedReport || !responseText.trim()) return

    setIsSubmittingResponse(true)
    try {
      const { error } = await supabase.from("admin_responses").insert({
        report_id: selectedReport.id,
        response: responseText,
      })

      if (error) throw error

      await fetchReports()
      setResponseText("")
      setSelectedReport(null)
    } catch (error) {
      console.error("Error submitting response:", error)
    } finally {
      setIsSubmittingResponse(false)
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

  const uniqueCrimeTypes = [...new Set(reports.map((report) => report.crime_type))]

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading reports...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Crime Reports</h2>
          <p className="text-muted-foreground">Review and respond to submitted reports</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {filteredReports.length} of {reports.length} Reports
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={crimeTypeFilter} onValueChange={setCrimeTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by crime type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crime Types</SelectItem>
            {uniqueCrimeTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
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
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(report.status)}>{getStatusText(report.status)}</Badge>
                  {report.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{report.description}</p>

              {report.user && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Reported by: {report.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    CNIC: {report.user.cnic} | Phone: {report.user.phone}
                    {report.user.email && ` | Email: ${report.user.email}`}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {report.admin_responses && report.admin_responses.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {report.admin_responses.length} Response(s)
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Select value={report.status} onValueChange={(value) => updateReportStatus(report.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View & Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{report.crime_type}</DialogTitle>
                        <DialogDescription>
                          Report submitted on {format(new Date(report.created_at), "MMMM dd, yyyy at hh:mm a")}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm bg-muted p-3 rounded-lg">{report.description}</p>
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
                              className="max-w-full h-auto rounded-lg border"
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

                        {report.user && (
                          <div>
                            <h4 className="font-semibold mb-2">Reporter Information</h4>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Name:</strong> {report.user.name}
                              </p>
                              <p className="text-sm">
                                <strong>CNIC:</strong> {report.user.cnic}
                              </p>
                              <p className="text-sm">
                                <strong>Phone:</strong> {report.user.phone}
                              </p>
                              {report.user.email && (
                                <p className="text-sm">
                                  <strong>Email:</strong> {report.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {report.admin_responses && report.admin_responses.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Previous Responses</h4>
                            <div className="space-y-2">
                              {report.admin_responses.map((response) => (
                                <div key={response.id} className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                                  <p className="text-sm">{response.response}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {format(new Date(response.created_at), "MMM dd, yyyy at hh:mm a")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-2">Add Response</h4>
                          <Textarea
                            placeholder="Enter your response to this report..."
                            value={selectedReport?.id === report.id ? responseText : ""}
                            onChange={(e) => {
                              setResponseText(e.target.value)
                              setSelectedReport(report)
                            }}
                            rows={4}
                          />
                          <Button
                            onClick={submitResponse}
                            disabled={!responseText.trim() || isSubmittingResponse || selectedReport?.id !== report.id}
                            className="mt-2"
                          >
                            {isSubmittingResponse ? "Submitting..." : "Submit Response"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              {searchTerm || statusFilter !== "all" || crimeTypeFilter !== "all"
                ? "No reports found matching the current filters."
                : "No crime reports submitted yet."}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
