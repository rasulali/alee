'use client'
import Link from "next/link"
import Logo from "./logo"
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const Nav = () => {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="flex items-center justify-between pt-12 p-8">
      <div className="flex flex-col h-full gap-2">
        <Link href="/">
          <Logo className="text-primary md:h-4" />
        </Link>
        <div className="text-sm text-primary font-semibold leading-none flex flex-col">
          <h1 className="">Artisian Apps &</h1>
          <h1>Websites</h1>
        </div>
      </div>
      <button
        onClick={toggleDarkMode}
        className={cn({
          'justify-end': theme === 'light',
          'justify-start': theme === 'dark',
        }, "w-16 h-8 flex rounded-[32px] border-2 border-primary p-1.5")}>
        <motion.div
          layout
          transition={{
            type: "spring",
            visualDuration: 0.2,
            bounce: 0.2,
          }}
          className="h-full bg-primary rounded-full aspect-square">
        </motion.div>
      </button>
    </nav>
  );
}

export default Nav;
