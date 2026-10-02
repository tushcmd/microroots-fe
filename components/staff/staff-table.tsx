"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllStaffProfiles } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { mockStaff } from "@/lib/mock-data"
import type { StaffProfile } from "@/lib/types"
import { AddStaffDialog } from "./add-staff-dialog"
import { StaffDetailSheet } from "./staff-detail-sheet"

export function StaffTable() {
  const { session } = useAuth()
  const [staff, setStaff] = useState<StaffProfile[]>(mockStaff)
  const [query, setQuery] = useState("")
  const [position, setPosition] = useState("all")
  const [selected, setSelected] = useState<StaffProfile | null>(null)

  async function refresh() {
    if (!session) return
    try {
      const data = await getAllStaffProfiles(session.token)
      if (data.length) setStaff(data as StaffProfile[])
    } catch {
      // Leave the current (mock or last-known) list in place rather than
      // wiping the table on a transient network error.
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const positions = useMemo(
    () => [...new Set(staff.map((person) => person.staff_position_details.position_title))],
    [staff],
  )

  const filtered = useMemo(
    () =>
      staff.filter(
        (person) =>
          `${person.first_name} ${person.last_name}`.toLowerCase().includes(query.toLowerCase()) &&
          (position === "all" || person.staff_position_details.position_title === position),
      ),
    [staff, query, position],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Team management</p>
          <h1 className="text-2xl font-semibold tracking-tight">Staff profiles</h1>
        </div>
        <AddStaffDialog onCreated={refresh} />
      </div>

      <Card className="border-border/70 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search staff by name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={position} onValueChange={(value) => setPosition(value ?? "all")}>
              <SelectTrigger className="w-full sm:w-[210px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {positions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff member</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((person) => (
                  <TableRow key={person.id} className="cursor-pointer" onClick={() => setSelected(person)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {person.first_name[0]}
                            {person.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {person.first_name} {person.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{person.staff_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{person.staff_position_details.position_title}</TableCell>
                    <TableCell className="text-muted-foreground">{person.email_address}</TableCell>
                    <TableCell className="text-muted-foreground">{person.phone_number}</TableCell>
                    <TableCell>
                      <Badge variant={person.is_profile_active ? "default" : "secondary"}>
                        {person.is_profile_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StaffDetailSheet staff={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
