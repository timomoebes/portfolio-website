"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

const proofCards = [
  {
    title: "OpenClaw Consulting",
    copy: "AI workflow audits, implementation scopes, and human-approved automation around lead handling, CRM enrichment, post-call execution, reporting loops, and internal operations.",
  },
  {
    title: "Gym Near Me Cyprus",
    copy: "AI-assisted local directory SaaS with data enrichment, SEO structure, full-stack deployment, and monetization logic for featured listings.",
  },
  {
    title: "Enterprise AI discipline",
    copy: "Technical services and AI champion work in healthcare SaaS, including GDPR-aware agent workflows and practical support-process improvements.",
  },
]

export default function AboutSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-purple-950 to-blue-950" : "bg-gradient-to-br from-purple-50 to-blue-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-5xl mx-auto">
          <p className={`text-sm font-semibold uppercase tracking-[0.25em] text-center mb-4 ${isDark ? "text-blue-200" : "text-blue-700"}`}>Relevant work behind the offer</p>
          <h2 className={`text-3xl sm:text-5xl font-black text-center mb-6 ${isDark ? "text-white" : "text-slate-950"}`}>Built from real AI, workflow, and operations work.</h2>
          <p className={`text-lg sm:text-xl leading-relaxed text-center max-w-3xl mx-auto mb-12 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            I started in healthcare technology and technical services, where vague systems break trust fast. That shaped how I build with AI now: useful automation, clear handoffs, human approval where it matters, and evidence that the workflow actually works.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {proofCards.map((card) => (
              <div key={card.title} className={`rounded-2xl border p-6 ${isDark ? "border-white/15 bg-white/10" : "border-slate-200 bg-white"}`}>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-950"}`}>{card.title}</h3>
                <p className={isDark ? "text-slate-300" : "text-slate-600"}>{card.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
