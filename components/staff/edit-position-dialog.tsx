"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editStaffPosition } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { notifyError } from "@/lib/notify"
import type { StaffPosition } from "@/lib/types"

function EditPositionForm({
  position,
  onClose,
  onSaved,
}: {
  position: StaffPosition
  onClose: () => void
  onSaved: () => void
}) {
  const { session } = useAuth()
  const [name, setName] = useState(position.position_name ?? position.position_title ?? "")
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!session) return
    setLoading(true)
    try {
      await editStaffPosition({ staff_position_id: position.id, staff_position_name: name.trim() }, session.token)
      toast.success("Position updated")
      onSaved()
      onClose()
    } catch (e) {
      notifyError(e, "Couldn't save the position.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 py-4">
        <Label>Position name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={loading || !name.trim()}>{loading ? "Saving…" : "Save"}</Button>
      </DialogFooter>
    </>
  )
}

export function EditPositionDialog({
  position,
  onClose,
  onSaved,
}: {
  position: StaffPosition | null
  onClose: () => void
  onSaved: () => void
}) {
  return (
    <Dialog open={!!position} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit position</DialogTitle>
          <DialogDescription>Update the position name.</DialogDescription>
        </DialogHeader>
        {position && <EditPositionForm key={position.id} position={position} onClose={onClose} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
