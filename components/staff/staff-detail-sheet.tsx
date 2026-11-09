"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { deleteStaffProfile, getAllStaffPositions, updateStaffProfile } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText, formatDate } from "@/lib/display"
import { notifyError } from "@/lib/notify"
import type { StaffPosition, StaffProfile } from "@/lib/types"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StaffRolesEditor } from "./staff-roles-editor"

function StaffDetailForm({
  staff,
  onClose,
  onChanged,
}: {
  staff: StaffProfile
  onClose: () => void
  onChanged: () => void
}) {
  const { session } = useAuth()
  const [positions, setPositions] = useState<StaffPosition[]>([])
  const [first, setFirst] = useState(staff.first_name ?? "")
  const [last, setLast] = useState(staff.last_name ?? "")
  const [email, setEmail] = useState(staff.email_address ?? "")
  const [positionId, setPositionId] = useState<string>(
    staff.staff_position_id != null ? String(staff.staff_position_id) : "",
  )
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!session) return
    let cancelled = false
    getAllStaffPositions(session.token)
      .then((data) => {
        if (cancelled) return
        const list = data as StaffPosition[]
        setPositions(list)
        if (!positionId) {
          const match = list.find((p) => p.position_title === staff.staff_position)
          if (match) setPositionId(String(match.id))
        }
      })
      .catch(() => {
        if (!cancelled) setPositions([])
      })
    return () => {
      cancelled = true
    }
  }, [session, staff.staff_position, positionId])

  async function saveProfile() {
    if (!session) return
    setSaving(true)
    try {
      await updateStaffProfile(
        {
          staff_profile_id: staff.id,
          first_name: first.trim(),
          last_name: last.trim(),
          email_address: email.trim(),
          ...(positionId ? { staff_position_id: positionId } : {}),
        },
        session.token,
      )
      toast.success("Profile updated")
      onChanged()
    } catch (e) {
      notifyError(e, "Couldn't save the profile. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>First name</Label>
          <Input value={first} onChange={(e) => setFirst(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Last name</Label>
          <Input value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label>Position</Label>
          <Select value={positionId || undefined} onValueChange={(v) => setPositionId(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {displayText(p.position_title ?? p.position_name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={saveProfile} disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </Button>

      <hr className="border-border/70" />
      <StaffRolesEditor staffId={staff.id} />

      <hr className="border-border/70" />
      <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
        Delete staff profile
      </Button>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete staff profile?"
        description="This removes the profile and its associated records. This action can't be undone."
        onConfirm={async () => {
          if (!session) return
          await deleteStaffProfile(staff.id, session.token)
          toast.success("Profile deleted")
          onChanged()
          onClose()
        }}
      />
    </div>
  )
}

export function StaffDetailSheet({
  staff,
  onClose,
  onChanged,
}: {
  staff: StaffProfile | null
  onClose: () => void
  onChanged: () => void
}) {
  return (
    <Sheet open={!!staff} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {[staff?.first_name, staff?.last_name].filter(Boolean).join(" ") ||
              displayText(staff?.email_address, "Staff member")}
          </SheetTitle>
          <SheetDescription>
            {displayText(staff?.staff_number)} · Joined {formatDate(staff?.date_joined)}
          </SheetDescription>
        </SheetHeader>
        {staff && <StaffDetailForm key={staff.id} staff={staff} onClose={onClose} onChanged={onChanged} />}
      </SheetContent>
    </Sheet>
  )
}
