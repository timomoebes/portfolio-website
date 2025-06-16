"use client"

import { Github, Linkedin } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import AnimatedBackground from "./AnimatedBackground"
import Chatbot from "./Chatbot"
import { useTheme } from "./ThemeProvider"

interface HeroSectionProps {
  chatQuery?: string | null
}

export default function HeroSection({ chatQuery }: HeroSectionProps) {
  const { theme } = useTheme()
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    if (chatQuery) {
      setShowChatbot(true)
    }
  }, [chatQuery])

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Color */}
      <div
        className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-blue-950 to-black" : "bg-gradient-to-b from-blue-100 to-white"}`}
      />

      {/* Animated 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <AnimatedBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center md:flex-row md:items-start md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:max-w-2xl w-full"
        >
          <h1
            className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Timo Möbes
          </h1>
          <h2
            className={`text-xl sm:text-2xl md:text-4xl font-semibold mb-6 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
          >
            AI Engineer with Healthcare Domain Expertise
          </h2>
          <p className={`text-lg md:text-xl mb-8 max-w-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            From medical devices to intelligent systems - building AI that solves real problems
          </p>

          <motion.div
            className="flex justify-center md:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Link
              href="https://github.com/timomoebes"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md ${
                theme === "dark"
                  ? "bg-blue-600/60 text-white border border-blue-400 hover:bg-blue-600/80 hover:border-blue-300"
                  : "bg-blue-500/60 text-white border border-blue-600 hover:bg-blue-500/80 hover:border-blue-700"
              } transition-colors duration-200 focus:outline-none focus:ring-blue-300`}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/timomoebes/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md ${
                theme === "dark"
                  ? "bg-blue-600/60 text-white border border-blue-400 hover:bg-blue-600/80 hover:border-blue-300"
                  : "bg-blue-500/60 text-white border border-blue-600 hover:bg-blue-500/80 hover:border-blue-700"
              } transition-colors duration-200 focus:outline-none focus:ring-blue-300`}
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* FIXED Character Icon */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-0 bg-transparent rounded-full shadow-lg"
          onClick={() => setShowChatbot(!showChatbot)}
        >
          <Image
            src="/character.png"
            alt="Chat with me"
            width={80}
            height={80}
            className="object-contain"
          />
        </motion.button>
      </div>

      {/* FIXED Chatbot */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 z-40 inset-x-4 max-w-sm mx-auto md:bottom-24 md:right-4 md:inset-x-auto md:w-80 md:mx-0"
          >
            <Chatbot initialMessage={chatQuery} showChatbot={showChatbot} onClose={() => setShowChatbot(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}