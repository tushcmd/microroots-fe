"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ApiError,
  addStaffImage,
  deleteStaffImage,
  getAllStaffProfiles,
  getStaffImages,
  mediaUrl,
  updateStaffProfile,
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayInitials } from "@/lib/display"
import { notifyError } from "@/lib/notify"
import type { StaffImage, StaffProfile } from "@/lib/types"

export function ProfileCard() {
  const { session, login } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<StaffProfile | null>(null)
  const [images, setImages] = useState<StaffImage[]>([])
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [loadError, setLoadError] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const loadImages = useCallback(
    async (id: number) => {
      if (!session) return
      try {
        setImages(await getStaffImages(id))
      } catch {
        setImages([])
      }
    },
    [session],
  )

  useEffect(() => {
    if (!session) return
    let cancelled = false
    const staffNumber = session.staffNumber
    if (!staffNumber) {
      queueMicrotask(() => {
        if (!cancelled) setLoadError("Sign out and sign back in once to enable profile editing.")
      })
      return () => {
        cancelled = true
      }
    }
    getAllStaffProfiles()
      .then((all) => {
        if (cancelled) return
        const me = (all as StaffProfile[]).find(
          (p) => p.staff_number.toLowerCase() === staffNumber.toLowerCase(),
        )
        if (!me) {
          setLoadError("Couldn't find your staff profile.")
          return
        }
        setProfile(me)
        setFirst(me.first_name ?? "")
        setLast(me.last_name ?? "")
        loadImages(me.id)
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load your profile.")
      })
    return () => {
      cancelled = true
    }
  }, [session, loadImages])

  const current = images.length
    ? [...images].sort((a, b) => Number(b.image_id) - Number(a.image_id))[0]
    : null

  async function saveName() {
    if (!session || !profile) return
    setSaving(true)
    try {
      await updateStaffProfile(
        { staff_profile_id: profile.id, first_name: first.trim(), last_name: last.trim() },
      )
      login({ ...session, name: `${first} ${last}`.trim() || session.name })
      toast.success("Name updated")
    } catch (e) {
      if (e instanceof ApiError && e.status === 406) {
        notifyError(e, "Couldn't save. Your account may not have permission to edit profile details, or a field is invalid.")
      } else {
        notifyError(e, "Couldn't save your name. Try again.")
      }
    } finally {
      setSaving(false)
    }
  }

  async function onPickFile(file: File | undefined) {
    if (!session || !profile || !file) return
    setUploading(true)
    try {
      await addStaffImage(profile.id, file)
      await loadImages(profile.id)
      setImgFailed(false)
      toast.success("Photo updated")
    } catch (e) {
      notifyError(e, "Couldn't upload the photo. Try a smaller JPG or PNG.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function removePhoto() {
    if (!session || !profile || !current) return
    setUploading(true)
    try {
      await deleteStaffImage(Number(current.image_id))
      await loadImages(profile.id)
      toast.success("Photo removed")
    } catch (e) {
      notifyError(e, "Couldn't remove the photo.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">My profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {loadError && <p className="text-sm text-muted-foreground">{loadError}</p>}

        {profile && (
          <>
            <div className="flex items-center gap-4">
              {current && !imgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote media URL from API
                <img
                  src={mediaUrl(current.image_url)}
                  alt="Profile photo"
                  className="size-16 rounded-full border object-cover"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">
                  {displayInitials(first, last, profile.email_address)}
                </div>
              )}
              {imgFailed && (
                <p className="text-xs text-destructive">
                  Photo saved but the server isn&apos;t serving it. Check the /media/ setup.
                </p>
              )}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                    <Camera data-icon="inline-start" /> {uploading ? "Working…" : current ? "Change photo" : "Add photo"}
                  </Button>
                  {current && (
                    <Button variant="ghost" size="sm" disabled={uploading} onClick={removePhoto}>
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{profile.staff_number} · {profile.email_address}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>

            <Button onClick={saveName} disabled={saving || (!first.trim() && !last.trim())}>
              {saving ? "Saving…" : "Save name"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
