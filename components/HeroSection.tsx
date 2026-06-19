"use client"

import { ArrowRight, ExternalLink, Github, Linkedin } from "lucide-react"
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

const proofSignals = [
  "OpenClaw Consulting",
  "Gym Near Me Cyprus",
  "Doctolib AI Champion",
  "GDPR-aware agent workflows",
]

export default function HeroSection({ chatQuery }: HeroSectionProps) {
  const { theme } = useTheme()
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    if (chatQuery) {
      setShowChatbot(true)
    }
  }, [chatQuery])

  const isDark = theme === "dark"

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-28 pb-16">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-slate-950 via-blue-950 to-black" : "bg-gradient-to-b from-blue-100 via-white to-slate-100"}`} />

      <div className="absolute inset-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <AnimatedBackground />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className={`mb-5 text-sm sm:text-base font-semibold tracking-[0.25em] uppercase ${isDark ? "text-blue-200" : "text-blue-800"}`}>
              Timo Möbes · AI Workflow Architect
            </p>
            <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6 ${isDark ? "text-white" : "text-slate-950"}`}>
              I build AI workflow systems that survive real operations.
            </h1>
            <p className={`text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mb-8 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              I combine healthcare technology discipline, enterprise support experience, and AI-assisted product shipping to turn messy work into practical systems for consulting, CRM, reporting, lead handling, and SaaS experiments.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                See proof of work <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.openclawconsulting.online/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition border ${
                  isDark
                    ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                    : "border-slate-300 bg-white/80 text-slate-900 hover:bg-white"
                }`}
              >
                Work with me through OpenClaw <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 mb-8" aria-label="Proof signals">
              {proofSignals.map((signal) => (
                <span
                  key={signal}
                  className={`rounded-full px-3 py-1 text-sm font-medium border ${
                    isDark ? "border-white/15 bg-white/10 text-slate-200" : "border-slate-200 bg-white/80 text-slate-700"
                  }`}
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/timomoebes"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isDark ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-slate-950"}`}
              >
                <Github className="w-4 h-4" /> GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/timomoebes/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isDark ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-slate-950"}`}
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-md ${isDark ? "border-white/15 bg-white/10 text-white" : "border-slate-200 bg-white/80 text-slate-900"}`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300 mb-4">What the portfolio proves</p>
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-1">AI implementation, not AI theatre</h2>
                <p className={isDark ? "text-slate-300" : "text-slate-600"}>Workflow audits, agentic operations, human approval gates, and evidence-driven handoffs.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Product shipping under real constraints</h2>
                <p className={isDark ? "text-slate-300" : "text-slate-600"}>From local SaaS and SEO systems to consulting workflows, shipped fast and verified.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Healthcare-grade operational discipline</h2>
                <p className={isDark ? "text-slate-300" : "text-slate-600"}>Technical services, regulated environments, GDPR-aware AI work, and clear escalation logic.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="p-0 bg-transparent rounded-full shadow-lg"
          onClick={() => setShowChatbot(!showChatbot)}
          aria-label="Open Timo portfolio chat"
        >
          <Image src="/character.png" alt="Timo portfolio chat assistant" width={80} height={80} className="object-contain" />
        </motion.button>
      </div>

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
