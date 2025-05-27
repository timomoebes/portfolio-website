"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-8 z-50" // Changed from right-8 to left-8
        >
          <button
            onClick={scrollToTop}
            className={`
              p-3 rounded-full shadow-lg transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700 hover:scale-110"
                  : "bg-white text-gray-800 hover:bg-gray-100 hover:scale-110"
              }
            `}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
