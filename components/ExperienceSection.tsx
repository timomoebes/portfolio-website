"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

const primaryExperience = [
  {
    title: "Technical Consultant",
    company: "Self-employed / OpenClaw direction",
    period: "2025 - Present",
    description: "Building AI-powered SaaS products and practical consulting systems: workflow audits, implementation scopes, CRM enrichment, lead handling, reporting loops, and approval-gated automation.",
    tags: ["AI workflows", "SaaS", "CRM", "Reporting", "Next.js", "Automation"],
  },
  {
    title: "Technical Services Engineer & AI Champion",
    company: "Doctolib",
    period: "2024 - 2025",
    description: "Second-line technical support for complex product and infrastructure issues, AI initiatives for the German Technical Services team, and GDPR-aware agent workflow work.",
    tags: ["Healthcare SaaS", "GDPR", "SQL", "Support ops", "GenAI", "Jira"],
  },
  {
    title: "Onboarding Buddy AI Agent Developer",
    company: "Doctolib",
    period: "2025",
    description: "Designed a Dust-powered onboarding assistant with four interconnected agents for HR, IT, culture, and role-specific guidance after the Dust AI Agents Hackathon in Paris.",
    tags: ["Dust", "AI agents", "Onboarding", "Context design", "Compliance"],
  },
]

const supportingExperience = [
  "7+ years enterprise consulting and field support across smart home, networking, calibration, customer training, and troubleshooting.",
  "B.Eng. Health Electronics background across embedded systems, microcontrollers, medical-device style documentation, and hardware/software projects.",
  "Earlier media, SEO, content, and event-marketing work that now feeds practical consulting, positioning, and growth-system thinking.",
]

export default function ExperienceSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-blue-950 to-emerald-950" : "bg-gradient-to-br from-blue-50 to-emerald-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-4 ${isDark ? "text-blue-200" : "text-blue-700"}`}>Experience</p>
          <h2 className={`text-3xl sm:text-5xl font-black mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>The useful thread: technical systems, support pressure, AI implementation.</h2>
          <p className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            The background is not just a CV. It explains the way I build: keep the workflow clear, protect the human boundary, and verify the system before calling it done.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {primaryExperience.map((exp, index) => (
            <motion.article
              key={exp.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`rounded-2xl border p-6 ${isDark ? "border-white/15 bg-white/10" : "border-slate-200 bg-white shadow-sm"}`}
            >
              <p className={`text-sm font-semibold mb-2 ${isDark ? "text-blue-200" : "text-blue-700"}`}>{exp.period}</p>
              <h3 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-950"}`}>{exp.title}</h3>
              <p className={`font-semibold mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{exp.company}</p>
              <p className={`leading-relaxed mb-5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"}`}>{tag}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className={`rounded-2xl border p-6 ${isDark ? "border-white/15 bg-black/20" : "border-slate-200 bg-white/80"}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-950"}`}>Supporting background</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {supportingExperience.map((item) => (
              <p key={item} className={`leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
