'use client'

import Link from "next/link"
import Logo from "./logo"

const Nav = () => {
  return <Link
    href={'/'}
    className="w-full flex items-center justify-between absolute top-0 left-0 px-4 py-8 z-10
    bg-white/10 shadow-lg backdrop-blur-sm">
    <Logo className="text-black h-6 md:h-7" />
  </Link>
}
export default Nav
