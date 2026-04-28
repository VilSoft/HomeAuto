import React from "react"
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react"
import { Home } from "lucide-react"
import Link from "next/link"
import style from '@/styles/Nav.module.css'
import DDGSearch from "./DDGSearch"

export default function AppNavbar() {
  return (
    <Navbar
      maxWidth="full"
      className={style.nav}
      classNames={{
        wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      }}
    >
      <NavbarContent justify="start">
        <NavbarItem>
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight hidden sm:inline">
              Kai &amp; Kassie
            </span>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className={style.search}>
          <DDGSearch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
