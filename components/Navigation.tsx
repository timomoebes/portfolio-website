"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useCallback, useState, useEffect } from "react"
import { useTheme } from "./ThemeProvider"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useIsMobile } from "../hooks/use-mobile"
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
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const elem = document.getElementById(targetId)
    if (elem) {
      const offset = isMobile ? 70 : 80 // Smaller offset for mobile
      const elementPosition = elem.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    // Close mobile menu after navigation
    if (isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div
            className={`
              px-4 py-3 rounded-2xl backdrop-blur-md flex items-center justify-between
              ${theme === "dark" ? "bg-white/10 border border-white/20" : "bg-white/90 border border-gray-200/50 shadow-lg"}
            `}
          >
            <div className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Portfolio
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`
                  p-2 rounded-full transition-colors
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
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(!isMenuOpen)
                }}
                className={`
                  p-2 rounded-full transition-colors
                  ${
                    theme === "dark"
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`
                  fixed right-0 top-0 h-full w-80 max-w-[85vw] p-6 pt-20
                  ${theme === "dark" ? "bg-gray-900/95" : "bg-white/95"}
                  backdrop-blur-md border-l ${theme === "dark" ? "border-white/20" : "border-gray-200"}
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200
                        ${
                          theme === "dark"
                            ? "text-gray-300 hover:text-white hover:bg-white/10"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }
                      `}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop Navigation
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
