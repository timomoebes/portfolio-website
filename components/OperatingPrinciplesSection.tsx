"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

const principles = [
  {
    title: "Audit before automation",
    copy: "The workflow worth fixing first is rarely the loudest one. Diagnose the constraint before building the agent.",
  },
  {
    title: "Human approval beats blind autonomy",
    copy: "For client-facing, money-moving, or reputation-sensitive work, the best system keeps humans in the right loop.",
  },
  {
    title: "Evidence over vibes",
    copy: "A workflow is not finished because the demo looked good. It needs logs, checks, handoffs, and proof that the output arrived where it should.",
  },
  {
    title: "Ship thin, verify, then scale",
    copy: "The useful system is usually smaller than the exciting one. Start narrow, prove value, then extend deliberately.",
  },
]

export default function OperatingPrinciplesSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-violet-950 to-slate-950" : "bg-gradient-to-br from-violet-50 to-slate-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-4 ${isDark ? "text-violet-200" : "text-violet-700"}`}>How I work</p>
          <h2 className={`text-3xl sm:text-5xl font-black mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>AI systems need judgment, not just prompts.</h2>
          <p className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            These principles are the bridge between my portfolio and the work I do through OpenClaw: practical automation with clear boundaries.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`rounded-2xl border p-6 ${isDark ? "border-white/15 bg-white/10" : "border-slate-200 bg-white shadow-sm"}`}
            >
              <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-950"}`}>{principle.title}</h3>
              <p className={isDark ? "text-slate-300" : "text-slate-700"}>{principle.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
