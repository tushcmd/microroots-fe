import { toast } from "sonner"
import { ApiError } from "@/lib/api"

// Network failures have a useful message; the API's 406/500 bodies don't
// (the docs say errors are often stringified dicts or HTML), so use the fallback.
export function notifyError(error: unknown, fallback: string) {
  toast.error(error instanceof ApiError && error.status === 0 ? error.message : fallback)
}