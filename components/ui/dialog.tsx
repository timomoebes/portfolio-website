"use client"

import { useState, type ReactNode } from "react"
import { motion } from "framer-motion"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.9 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50`}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-lg shadow-lg p-6 max-w-lg w-full
          ${open ? "opacity-100" : "opacity-0"}
        `}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

export const DialogContent = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}
