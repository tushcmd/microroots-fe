"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getAllAvailableRoles } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/types"

export function RolesView() {
  const { session } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    if (!session) return
    getAllAvailableRoles(session.token)
      .then((data) => setRoles(data as Role[]))
      .catch(() => {})
  }, [session])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Access control</p>
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Assigning roles to a specific staff member isn't built yet — this lists what's
          available. Add that from a staff member's detail view once needed.
        </p>
      </div>

      <Card className="border-border/70 shadow-none">
        <CardContent className="flex flex-col divide-y p-0">
          {roles.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No roles returned yet.</p>
          )}
          {roles.map((role) => (
            <div key={role.id} className="p-4">
              <p className="text-sm font-medium">
                {role.role_title} <span className="text-muted-foreground">#{role.role_number}</span>
              </p>
              <p className="text-xs text-muted-foreground">{role.role_description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
