"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

const background = [
  "B.Eng. Health Electronics — Berlin University of Applied Sciences",
  "Technical Services / Healthcare SaaS experience — Doctolib",
  "Google Prompting Essentials and Google Cloud Introduction to Generative AI",
  "Doctolib AI Essentials for Tech certification",
  "Metabase Explorer & Creator training",
  "Python programming foundation and applied automation practice",
]

export default function EducationSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-red-950 to-purple-950" : "bg-gradient-to-br from-red-50 to-purple-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-4 ${isDark ? "text-rose-200" : "text-rose-700"}`}>Background</p>
          <h2 className={`text-3xl sm:text-5xl font-black mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>The credibility layer under the build work.</h2>
          <p className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            The formal background supports the practical work: engineering fundamentals, healthcare/regulated context, AI training, data tools, and technical service pressure.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {background.map((item, index) => (
            <motion.div
              key={item}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className={`rounded-2xl border p-5 font-medium ${isDark ? "border-white/15 bg-white/10 text-slate-200" : "border-slate-200 bg-white text-slate-700 shadow-sm"}`}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
