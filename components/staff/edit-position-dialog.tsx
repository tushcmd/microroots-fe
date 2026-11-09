"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateStaffPosition } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { StaffPosition } from "@/lib/types"

export function EditPositionDialog({
  position,
  onClose,
  onSaved,
}: {
  position: StaffPosition | null
  onClose: () => void
  onSaved: () => void
}) {
  const { session } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (position) {
      setTitle(position.position_title ?? "")
      setDescription(position.position_description ?? "")
      setError("")
    }
  }, [position])

  async function save() {
    if (!session || !position) return
    setLoading(true)
    setError("")
    try {
      await updateStaffPosition(
        { position_id: position.id, position_title: title, position_description: description },
        session.token,
      )
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the position.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!position} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit position</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Position title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={loading || !title}>{loading ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}