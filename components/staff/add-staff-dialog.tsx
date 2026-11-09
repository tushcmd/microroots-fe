"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { createStaffProfile } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { notifyError } from "@/lib/notify"

export function AddStaffDialog({ onCreated }: { onCreated?: () => void }) {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!session) return
    setLoading(true)
    try {
      await createStaffProfile(email, session.token)
      toast.success("Staff account created. Credentials were emailed.")
      setOpen(false)
      setEmail("")
      onCreated?.()
    } catch (e) {
      notifyError(e, "Couldn't create the account. Check the email and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" /> Add staff
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add staff profile</DialogTitle>
          <DialogDescription>
            Create an account and send credentials to a staff member&apos;s email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          <Label htmlFor="staff-email">Email address</Label>
          <Input
            id="staff-email"
            type="email"
            placeholder="name@microroots.ke"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || !email}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
