"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader, PageRoot } from "@/components/pages/shared/page-chrome"
import { getAllAvailableRoles } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import type { Role } from "@/lib/types"

export function RolesView() {
  const { session } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    if (!session) return
    getAllAvailableRoles()
      .then((data) => setRoles(data as Role[]))
      .catch(() => setRoles([]))
  }, [session])

  return (
    <PageRoot>
      <PageHeader
        eyebrow="Access control"
        title="Roles & permissions"
        description="Assigning roles to staff and managing role definitions require endpoints that are not yet available. The roles your account can view are listed below."
      />

      {roles.length === 0 ? (
        <Card className="border-border/70 shadow-none">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No roles to display, or this account doesn&apos;t have access to view them.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="border-border/70 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{displayText(role.role_title)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {displayText(role.description ?? role.role_description)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageRoot>
  )
}
