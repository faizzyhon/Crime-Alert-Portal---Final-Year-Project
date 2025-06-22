"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/types"
import { format } from "date-fns"
import { Search, Users, Phone, Mail, CreditCard } from "lucide-react"

export function AdminUsers() {
  const [users, setUsers] = useState<(User & { report_count: number })[]>([])
  const [filteredUsers, setFilteredUsers] = useState<(User & { report_count: number })[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cnic.includes(searchTerm) ||
        user.phone.includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) throw usersError

      const usersWithCounts = await Promise.all(
        (usersData || []).map(async (user) => {
          const { count } = await supabase
            .from("crime_reports")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)

          return {
            ...user,
            report_count: count || 0,
          }
        }),
      )

      setUsers(usersWithCounts)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Registered Users</h2>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {users.length} Total Users
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, CNIC, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>Joined {format(new Date(user.created_at), "MMM dd, yyyy")}</CardDescription>
                </div>
                <Badge variant="secondary">
                  {user.report_count} Report{user.report_count !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">CNIC</p>
                    <p className="text-sm text-muted-foreground">{user.cnic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">No users found matching "{searchTerm}"</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
