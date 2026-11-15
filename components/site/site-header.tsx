"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { SiteBrand } from "@/components/site/site-brand"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks, site } from "@/lib/site"
import { cn } from "@/lib/utils"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function SiteHeader() {
  const pathname = usePathname() || "/"

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <SiteBrand />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                isActive(pathname, link.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className="hidden rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 sm:inline-flex"
          >
            Staff login
          </Link>
          <Link
            href="/shop"
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            Shop now
          </Link>

          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "md:hidden",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 p-0">
              <SheetHeader className="border-b border-border/70 p-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SiteBrand />
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col p-2">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        aria-current={isActive(pathname, link.href) ? "page" : undefined}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
                          isActive(pathname, link.href)
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border/70 p-4">
                <SheetClose
                  render={
                    <Link href="/shop" className={buttonVariants()}>
                      Shop now
                    </Link>
                  }
                />
                <SheetClose
                  render={
                    <Link
                      href="/login"
                      className="rounded-lg px-3 py-2 text-center text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  }
                >
                  Staff login
                </SheetClose>
                <p className="pt-1 text-center text-[11px] text-muted-foreground">
                  {site.contact.location}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}