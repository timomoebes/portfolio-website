"use client"

import { motion } from "framer-motion"
import { useCallback } from "react"
import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "lucide-react"
import type React from "react"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
]

export default function Navigation() {
  const { theme, toggleTheme } = useTheme()

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const elem = document.getElementById(targetId)
    if (elem) {
      const offset = 80 // Account for fixed header
      const elementPosition = elem.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center"
    >
      <div
        className={`
        px-2 py-2 rounded-full backdrop-blur-md
        ${theme === "dark" ? "bg-white/10 border border-white/20" : "bg-white/70 border border-gray-200/50 shadow-lg"}
      `}
      >
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className={`
                px-4 py-2 rounded-full text-sm transition-colors duration-200
                ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              `}
            >
              {item.name}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-full transition-colors ml-2
              ${
                theme === "dark"
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
