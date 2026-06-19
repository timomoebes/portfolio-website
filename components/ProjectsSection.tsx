"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

const featuredProjects = [
  {
    title: "OpenClaw Consulting",
    label: "AI workflow audit and implementation system",
    url: "https://www.openclawconsulting.online/",
    problem: "Founder-led businesses have messy workflows, unclear automation priorities, and no evidence loop for what should be fixed first.",
    built: "Audit-to-implementation spine with human-approved automation around lead handling, CRM enrichment, post-call execution, reporting loops, and internal operations.",
    proof: "Shows the consulting operating model behind my current work: diagnose first, scope tightly, build practical systems, keep approval gates where they matter.",
  },
  {
    title: "Gym Near Me Cyprus",
    label: "AI-assisted local directory SaaS",
    url: "https://gymnearme.cy/",
    problem: "Local gym discovery in Cyprus is fragmented, search intent is underserved, and monetization needs a clean directory structure.",
    built: "Business data enrichment, SEO content structure, full-stack directory deployment, local search pages, and featured-listing monetization logic.",
    proof: "Shows end-to-end product thinking: market research, data processing, web development, SEO, monetization, and deployment.",
  },
  {
    title: "AI Research Agent",
    label: "Agentic research workflow",
    github: "https://github.com/timomoebes/ai-research-agent-langgraph",
    problem: "Research across tools and sources gets slow, inconsistent, and hard to compare when the workflow is manual.",
    built: "LangGraph/OpenAI/Firecrawl/Pydantic workflow for discovery, scraping, structured extraction, comparison, and recommendation output.",
    proof: "Shows agent architecture, structured data flow, and useful automation beyond a toy chatbot.",
  },
]

const supportingProjects = [
  "Simplify Yourself website remake — modern responsive rebuild, PWA work, Three.js interactions, SEO/performance cleanup.",
  "Interactive portfolio — Next.js, TypeScript, Tailwind, Framer Motion, 3D background, chatbot integration.",
  "ECG and blood-pressure monitoring projects — embedded systems, microcontrollers, sensors, wireless data, hardware/software integration.",
  "3D printer monitoring — Raspberry Pi, OctoPrint, remote monitoring, Linux, safety logic.",
  "PDF to MP3 converter — Python accessibility utility for turning documents into audio.",
]

export default function ProjectsSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-yellow-950 to-red-950" : "bg-gradient-to-br from-yellow-50 to-red-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-4 ${isDark ? "text-amber-200" : "text-amber-700"}`}>Featured proof</p>
          <h2 className={`text-3xl sm:text-5xl font-black mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>Projects that explain the current direction.</h2>
          <p className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            The point is not a long gallery. These are the strongest signals for AI workflow consulting, product shipping, and operational implementation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`rounded-2xl border p-6 flex flex-col ${isDark ? "border-white/15 bg-white/10" : "border-slate-200 bg-white shadow-sm"}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>{project.title}</h3>
                  <p className={`font-semibold ${isDark ? "text-amber-200" : "text-amber-700"}`}>{project.label}</p>
                </div>
                {project.url && <Link href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} className="p-2 rounded-full hover:bg-white/10"><ExternalLink className="w-5 h-5" /></Link>}
                {project.github && <Link href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} GitHub repository`} className="p-2 rounded-full hover:bg-white/10"><Github className="w-5 h-5" /></Link>}
              </div>
              <div className="space-y-4 flex-1">
                <div><p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Problem</p><p className={isDark ? "text-slate-300" : "text-slate-700"}>{project.problem}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Built</p><p className={isDark ? "text-slate-300" : "text-slate-700"}>{project.built}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Proof value</p><p className={isDark ? "text-slate-300" : "text-slate-700"}>{project.proof}</p></div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={`rounded-2xl border p-6 ${isDark ? "border-white/15 bg-black/20" : "border-slate-200 bg-white/80"}`}>
          <h3 className={`text-2xl font-bold mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>Supporting project history</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {supportingProjects.map((project) => (
              <p key={project} className={`leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{project}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
