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
    <nav className="flex backdrop-blur drop-shadow items-center justify-between pt-12 p-8 transition-colors duration-300">
      <Link href="/">
        <Logo className="text-black dark:text-white h-6 md:h-7" />
      </Link>
      <button
        onClick={toggleDarkMode}
        className={cn({
          'justify-end': theme === 'light',
          'justify-start': theme === 'dark',
        }, "w-16 h-8 flex rounded-[32px] border-2 border-zinc-900 dark:border-white p-1.5")}>
        <motion.div
          layout
          transition={{
            type: "spring",
            visualDuration: 0.2,
            bounce: 0.2,
          }}
          className="h-full bg-zinc-900 dark:bg-white rounded-full aspect-square">
        </motion.div>
      </button>
    </nav>
  );
}

export default Nav;
