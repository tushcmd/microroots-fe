"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editStaffRoles, getAllAvailableRoles, getStaffRoles } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { notifyError } from "@/lib/notify"
import type { Role, RoleInstance } from "@/lib/types"

type Row = { roleId: number; title: string; subRoles: string[] }

export function StaffRolesEditor({ staffId }: { staffId: number }) {
  return <StaffRolesEditorInner key={staffId} staffId={staffId} />
}

function StaffRolesEditorInner({ staffId }: { staffId: number }) {
  const { session } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [roleId, setRoleId] = useState("")
  const [subRole, setSubRole] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session) return
    let cancelled = false
    Promise.all([getStaffRoles(staffId, session.token), getAllAvailableRoles(session.token)])
      .then(([instances, available]) => {
        if (cancelled) return
        setRoles(available as Role[])
        const map = new Map<number, Row>()
        for (const inst of instances as RoleInstance[]) {
          if (!inst.role) continue
          const row = map.get(inst.role.id) ?? {
            roleId: inst.role.id,
            title: inst.role.role_title ?? `Role ${inst.role.id}`,
            subRoles: [],
          }
          const n = inst.sub_role?.role_number
          if (n != null && !row.subRoles.includes(String(n))) row.subRoles.push(String(n))
          map.set(inst.role.id, row)
        }
        setRows([...map.values()])
        setLoaded(true)
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Couldn't load roles.")
          setLoaded(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [staffId, session])

  function addSubRole() {
    const n = subRole.trim()
    if (!roleId || !n) return
    const id = Number(roleId)
    setRows((prev) => {
      if (prev.some((r) => r.roleId === id)) {
        return prev.map((r) =>
          r.roleId === id && !r.subRoles.includes(n) ? { ...r, subRoles: [...r.subRoles, n] } : r,
        )
      }
      const title = roles.find((r) => r.id === id)?.role_title ?? `Role ${id}`
      return [...prev, { roleId: id, title, subRoles: [n] }]
    })
    setSubRole("")
  }

  function removeSubRole(id: number, n: string) {
    setRows((prev) =>
      prev
        .map((r) => (r.roleId === id ? { ...r, subRoles: r.subRoles.filter((s) => s !== n) } : r))
        .filter((r) => r.subRoles.length > 0),
    )
  }

  async function save() {
    if (!session) return
    setSaving(true)
    try {
      await editStaffRoles(
        staffId,
        rows.map((r) => ({ role_id: r.roleId, sub_role_numbers: r.subRoles })),
        session.token,
      )
      toast.success("Roles updated")
    } catch (e) {
      notifyError(e, "Couldn't save roles.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium">Roles & permissions</p>

      {loadError && <p className="text-sm text-destructive">{loadError}</p>}
      {!loaded && !loadError && <p className="text-sm text-muted-foreground">Loading roles…</p>}

      {loaded && (
        <>
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No roles assigned.</p>}
          {rows.map((row) => (
            <div key={row.roleId} className="flex flex-col gap-2 rounded-lg border p-3">
              <p className="text-sm font-medium">{row.title}</p>
              <div className="flex flex-wrap gap-2">
                {row.subRoles.map((n) => (
                  <Badge key={n} variant="secondary" className="gap-1">
                    Sub-role {n}
                    <button type="button" aria-label={`Remove sub-role ${n}`} onClick={() => removeSubRole(row.roleId, n)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Select value={roleId || undefined} onValueChange={(v) => setRoleId(v ?? "")}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.role_title ?? `Role ${r.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-28"
              placeholder="Sub-role #"
              value={subRole}
              onChange={(e) => setSubRole(e.target.value)}
            />
            <Button variant="outline" onClick={addSubRole} disabled={!roleId || !subRole.trim()}>
              Add
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Saving replaces all of this person&apos;s roles with the list above.
          </p>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save roles"}
          </Button>
        </>
      )}
    </div>
  )
}
