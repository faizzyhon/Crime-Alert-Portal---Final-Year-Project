"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { MapPin, Upload, Video } from "lucide-react"

const crimeTypes = ["Drug Activity", "Harassment", "Robbery", "Theft/Burglary", "Other"]

export function ReportCrimeForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    crimeType: "",
    otherCrimeType: "",
    location: "",
    description: "",
    videoLink: "",
    isAnonymous: false,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            location: `${latitude}, ${longitude}`,
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `crime-reports/${fileName}`

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from("images").getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile)
      }

      const crimeTypeValue = formData.crimeType === "Other" ? formData.otherCrimeType : formData.crimeType

      const { error } = await supabase.from("crime_reports").insert({
        user_id: user?.id,
        crime_type: crimeTypeValue,
        location: formData.location,
        description: formData.description,
        image_url: imageUrl,
        video_link: formData.videoLink || null,
        is_anonymous: formData.isAnonymous,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      setFormData({
        crimeType: "",
        otherCrimeType: "",
        location: "",
        description: "",
        videoLink: "",
        isAnonymous: false,
      })
      setImageFile(null)
    } catch (err) {
      setError("Failed to submit report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Your crime report has been submitted successfully. Authorities will review it and take appropriate action.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setSuccess(false)} className="mt-4">
            Submit Another Report
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a Crime</CardTitle>
        <CardDescription>Provide details about the criminal activity you witnessed or experienced.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="crimeType">Crime Type *</Label>
            <Select
              value={formData.crimeType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, crimeType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crime type" />
              </SelectTrigger>
              <SelectContent>
                {crimeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.crimeType === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="otherCrimeType">Specify Crime Type *</Label>
              <Input
                id="otherCrimeType"
                value={formData.otherCrimeType}
                onChange={(e) => setFormData((prev) => ({ ...prev, otherCrimeType: e.target.value }))}
                placeholder="Please specify the crime type"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location or use auto-detect"
              />
              <Button type="button" variant="outline" onClick={detectLocation}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed description of the incident..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoLink">Video Link (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="videoLink"
                value={formData.videoLink}
                onChange={(e) => setFormData((prev) => ({ ...prev, videoLink: e.target.value }))}
                placeholder="YouTube, Google Drive, or other video link"
              />
              <Video className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAnonymous: checked }))}
            />
            <Label htmlFor="anonymous">Report Anonymously</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting Report..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
