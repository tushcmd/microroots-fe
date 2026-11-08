"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createStaffPosition, getAllStaffPositions } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import type { StaffPosition } from "@/lib/types"

export function PositionsPanel() {
  const { session } = useAuth()
  const [positions, setPositions] = useState<StaffPosition[]>([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function refresh() {
    if (!session) return
    getAllStaffPositions(session.token)
      .then((data) => setPositions(data as StaffPosition[]))
      .catch(() => setPositions([]))
  }

  useEffect(refresh, [session])

  async function handleCreate() {
    if (!session) return
    setLoading(true)
    setError("")
    try {
      await createStaffPosition({ position_title: title, position_description: description }, session.token)
      setOpen(false)
      setTitle("")
      setDescription("")
      refresh()
    } catch {
      setError("Couldn't create the position.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus data-icon="inline-start" /> Add position
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add staff position</DialogTitle>
                <DialogDescription>Positions are assigned to staff profiles.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label>Position title</Label>
                  <Input
                    placeholder="e.g. Farm Supervisor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={loading || !title}>
                  {loading ? "Adding…" : "Add position"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col divide-y">
          {positions.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No positions yet.</p>
          )}
          {positions.map((position) => (
            <div key={position.id} className="py-3">
              <p className="text-sm font-medium">{displayText(position.position_title)}</p>
              <p className="text-xs text-muted-foreground">{displayText(position.position_description)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
