import { Leaf } from "lucide-react"

export function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-5" />
      </div>
      <div>
        <div className="text-sm font-medium tracking-tight">
          MicroRoots<span className="text-primary">Ke</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Farm operations
        </div>
      </div>
    </div>
  )
}
