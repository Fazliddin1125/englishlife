"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Building2,
  Briefcase,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { getBranchById } from "@/lib/store"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return null
  }

  const isSuperAdmin = user.role === "super_admin"
  const branch = user.branchId ? getBranchById(user.branchId) : null

  const superAdminNav: NavItem[] = [
    {
      label: "Boshqaruv paneli",
      href: "/dashboard/super-admin",
      icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    },
    {
      label: "Filiallar",
      href: "/dashboard/super-admin/branches",
      icon: <Building2 className="h-[18px] w-[18px]" />,
    },
    {
      label: "Lavozimlar",
      href: "/dashboard/super-admin/job-titles",
      icon: <Briefcase className="h-[18px] w-[18px]" />,
    },
    {
      label: "Barcha nomzodlar",
      href: "/dashboard/super-admin/candidates",
      icon: <Users className="h-[18px] w-[18px]" />,
    },
    {
      label: "Zahira",
      href: "/dashboard/super-admin/talent-pool",
      icon: <FileText className="h-[18px] w-[18px]" />,
    },
    {
      label: "Vakansiyalar",
      href: "/dashboard/super-admin/vacancies",
      icon: <FileText className="h-[18px] w-[18px]" />,
    },
  ]

  const branchAdminNav: NavItem[] = [
    {
      label: "Boshqaruv paneli",
      href: "/dashboard/branch-admin",
      icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    },
    {
      label: "Vakansiyalar",
      href: "/dashboard/branch-admin/vacancies",
      icon: <Briefcase className="h-[18px] w-[18px]" />,
    },
    {
      label: "Nomzodlar",
      href: "/dashboard/branch-admin/candidates",
      icon: <Users className="h-[18px] w-[18px]" />,
    },
  ]

  const navItems = isSuperAdmin ? superAdminNav : branchAdminNav

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="EnglishLife"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      <Separator />

      {/* User Info */}
      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <div className="mt-2 flex gap-2">
          {branch && (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <Building2 className="h-3 w-3" />
              {branch.name}
            </div>
          )}
          {isSuperAdmin && (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Super admin
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          Saytga o‘tish
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Chiqish
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-secondary/50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close */}
        <button
          className="absolute right-3 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
          <button
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user.name.charAt(0)}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
