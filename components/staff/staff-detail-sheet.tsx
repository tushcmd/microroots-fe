import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { StaffProfile } from "@/lib/types"

export function StaffDetailSheet({
  staff,
  onClose,
}: {
  staff: StaffProfile | null
  onClose: () => void
}) {
  return (
    <Sheet open={!!staff} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{staff && `${staff.first_name} ${staff.last_name}`}</SheetTitle>
          <SheetDescription>
            {staff?.staff_position_details.position_title} · {staff?.staff_number}
          </SheetDescription>
        </SheetHeader>
        {staff && (
          <div className="flex flex-col gap-6 px-6 py-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {staff.first_name[0]}
                  {staff.last_name[0]}
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
                <p className="mt-1 font-medium">{staff.phone_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Country</p>
                <p className="mt-1 font-medium">{staff.country_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Employment type</p>
                <p className="mt-1 font-medium">{staff.type_of_employment}</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
