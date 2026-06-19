"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

const capabilityGroups = [
  {
    title: "AI workflow implementation",
    items: ["Agent workflows", "Prompt/system design", "Human approval gates", "CRM enrichment", "Reporting loops", "Workflow audits"],
  },
  {
    title: "Product shipping",
    items: ["Next.js / React", "TypeScript", "Vercel", "Supabase / SQL", "SEO content systems", "Payments & monetization logic"],
  },
  {
    title: "Operational discipline",
    items: ["Healthcare/regulated environments", "Technical support systems", "Documentation", "QA/evidence logs", "Client handoffs", "Escalation clarity"],
  },
  {
    title: "Developer toolkit",
    items: ["Python", "Node.js", "APIs", "GitHub", "Docker", "Linux/Bash"],
  },
]

export default function SkillsSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center bg-gradient-to-br ${isDark ? "from-green-950 to-yellow-950" : "from-green-50 to-yellow-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-4 ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>Capabilities, not a random tech wall</p>
          <h2 className={`text-3xl sm:text-5xl font-black mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>What I can actually build with.</h2>
          <p className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            The useful part is not knowing a list of tools. It is knowing how to combine them into workflows that people can operate, trust, and improve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilityGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`rounded-2xl border p-6 ${isDark ? "border-white/15 bg-white/10" : "border-slate-200 bg-white shadow-sm"}`}
            >
              <h3 className={`text-2xl font-bold mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className={`rounded-full px-3 py-2 text-sm font-medium ${isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
