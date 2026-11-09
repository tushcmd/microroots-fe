"use client"

import { useCallback, useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader, PageRoot } from "@/components/pages/shared/page-chrome"
import { getAllStaffProfiles } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayInitials, displayText, formatDate } from "@/lib/display"
import type { StaffProfile } from "@/lib/types"
import { AddStaffDialog } from "./add-staff-dialog"
import { PositionsPanel } from "./positions-panel"
import { StaffDetailSheet } from "./staff-detail-sheet"

export function StaffTable() {
  const { session } = useAuth()
  const [profiles, setProfiles] = useState<StaffProfile[]>([])
  const [selected, setSelected] = useState<StaffProfile | null>(null)

  const refresh = useCallback(() => {
    if (!session) return
    getAllStaffProfiles()
      .then((data) => setProfiles(data as StaffProfile[]))
      .catch(() => setProfiles([]))
  }, [session])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <PageRoot>
      <PageHeader eyebrow="Team management" title="Staff">
        <AddStaffDialog onCreated={refresh} />
      </PageHeader>

      <Tabs defaultValue="profiles">
        <TabsList>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>
        <TabsContent value="profiles" className="mt-4">
          <Card className="overflow-hidden border-border/70 shadow-none">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Staff number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No staff profiles yet.
                    </TableCell>
                  </TableRow>
                )}
                {profiles.map((member) => {
                  const name =
                    [member.first_name, member.last_name].filter(Boolean).join(" ") || null
                  return (
                    <TableRow
                      key={member.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(member)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-[11px] text-primary">
                              {displayInitials(member.first_name, member.last_name, member.email_address)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{displayText(name)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {displayText(member.staff_position ?? member.staff_position_details?.position_title)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {displayText(member.staff_number)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {displayText(member.email_address)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(member.date_joined)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="positions" className="mt-4">
          <PositionsPanel />
        </TabsContent>
      </Tabs>

      <StaffDetailSheet
        staff={selected}
        onClose={() => setSelected(null)}
        onChanged={refresh}
      />
    </PageRoot>
  )
}
