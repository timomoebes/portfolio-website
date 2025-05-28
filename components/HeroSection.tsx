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

  // Open chatbot when query is received
  useEffect(() => {
    if (chatQuery) {
      setShowChatbot(true)
    }
  }, [chatQuery])

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-blue-950 to-black" : "bg-gradient-to-b from-blue-100 to-white"}`}
      />

      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <AnimatedBackground />
          </Suspense>
        </Canvas>
      </div>

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
            Engineer & AI Enthusiast
          </h2>
          <p className={`text-lg md:text-xl mb-8 max-w-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Transforming complex technical challenges into elegant solutions, bridging the gap between innovation and
            reliability.
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

        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative cursor-pointer"
          >
            <div className="w-[75px] sm:w-[100px] md:w-[150px]">
              <Image
                src="/character.png"
                alt="Illustrated character"
                width={300}
                height={400}
                className="w-auto h-[75px] sm:h-[100px] md:h-[150px] object-contain cursor-pointer hover:scale-105 transition-transform"
                style={{ transform: "scaleX(-1)" }}
                priority
                onClick={() => setShowChatbot(!showChatbot)}
              />
            </div>
            <AnimatePresence>
              {showChatbot && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 right-full mb-0 mr-4"
                >
                  <Chatbot initialMessage={chatQuery} showChatbot={showChatbot} onClose={() => setShowChatbot(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
