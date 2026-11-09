"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import { updateStaffProfile } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayInitials, displayName, displayText } from "@/lib/display"
import type { StaffPosition, StaffProfile } from "@/lib/types"
// added for staff roles editor
// import { useState as _unused } from "react" // not needed, useState is already imported
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { deleteStaffProfile, updateStaffProfile } from "@/lib/api"
import { StaffRolesEditor } from "./staff-roles-editor"

export function StaffDetailSheet({
  staff,
  positions,
  onClose,
  onUpdated,
}: {
  staff: StaffProfile | null
  positions: StaffPosition[]
  onClose: () => void
  onUpdated?: () => void
}) {
  const { session } = useAuth()
  const [positionId, setPositionId] = useState<string>("")
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (staff) {
      setPositionId(staff.staff_position_details ? String(staff.staff_position_details.id) : "")
      setActive(staff.is_profile_active)
      setError("")
    }
  }, [staff])

  async function handleSave() {
    if (!session || !staff) return
    setSaving(true)
    setError("")
    try {
      await updateStaffProfile(
        {
          staff_profile_id: staff.id,
          ...(positionId ? { staff_position: Number(positionId) } : {}),
          is_profile_active: active,
        },
        session.token,
      )
      onUpdated?.()
      onClose()
    } catch {
      setError("Couldn't save changes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={!!staff} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {staff && displayName(staff.first_name, staff.last_name, staff.email_address)}
          </SheetTitle>
          <SheetDescription>
            {staff?.staff_position_details?.position_title ?? "No position assigned"} ·{" "}
            {staff?.staff_number}
          </SheetDescription>
        </SheetHeader>
        {staff && (
          <div className="flex flex-col gap-6 px-6 py-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {displayInitials(staff.first_name, staff.last_name, staff.email_address)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{staff.email_address}</p>
                <Badge className="mt-1" variant={staff.is_profile_active ? "default" : "secondary"}>
                  {staff.is_profile_active ? "Active profile" : "Inactive profile"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Phone number</p>
                <p className="mt-1 font-medium">{displayText(staff.phone_number)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Country</p>
                <p className="mt-1 font-medium">{displayText(staff.country_name)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Employment type</p>
                <p className="mt-1 font-medium">{displayText(staff.type_of_employment)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t pt-5">
              <p className="text-sm font-medium">Edit profile</p>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Position</label>
                <Select value={positionId || undefined} onValueChange={(v) => setPositionId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="No position assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.position_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Profile active</label>
                <Button variant="outline" size="sm" onClick={() => setActive((a) => !a)}>
                  {active ? "Active" : "Inactive"}
                </Button>
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
            <div className="border-t pt-5">
              <StaffRolesEditor staffId={staff.id} />
            </div>

            <div className="flex flex-col gap-2 border-t pt-5">
              <p className="text-sm font-medium">Danger zone</p>
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                Delete profile
              </Button>
            </div>

            <ConfirmDialog
              open={confirmDelete}
              onOpenChange={setConfirmDelete}
              title="Delete this staff profile?"
              description="The profile is removed from the staff list. This can't be undone from the dashboard."
              onConfirm={async () => {
                await deleteStaffProfile(staff.id, session!.token)
                onUpdated?.()
                onClose()
              }}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
