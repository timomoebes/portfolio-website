"use client"

import Link from "next/link"
import { CalendarDays, ExternalLink } from "lucide-react"
import { useTheme } from "./ThemeProvider"

const BOOKING_URL = "https://app.cal.eu/openclawconsulting/ai-workflow-audit"

export default function BookingCTASection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id={id} className={`py-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"}`}>
      <div className="container mx-auto px-5 sm:px-8">
        <div className={`max-w-5xl mx-auto rounded-3xl border p-8 sm:p-12 ${isDark ? "border-white/15 bg-white/10" : "border-slate-200 bg-white shadow-sm"}`}>
          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 items-center">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-4 ${isDark ? "text-blue-200" : "text-blue-700"}`}>Turn proof into a workflow</p>
              <h2 className={`text-3xl sm:text-5xl font-black mb-5 ${isDark ? "text-white" : "text-slate-950"}`}>Want to find the automation worth building first?</h2>
              <p className={`text-lg leading-relaxed mb-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                If you have a messy lead, CRM, reporting, follow-up, or internal workflow, book the OpenClaw AI Workflow Audit. We map the current process, identify the highest-leverage bottleneck, and decide what AI can safely prepare before anything gets built.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {["One concrete workflow", "Human approval boundaries", "Next practical implementation step"].map((item) => (
                  <div key={item} className={`rounded-2xl border px-4 py-3 ${isDark ? "border-white/10 bg-black/20 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl border p-6 ${isDark ? "border-blue-300/20 bg-blue-400/10" : "border-blue-100 bg-blue-50"}`}>
              <CalendarDays className={isDark ? "w-9 h-9 mb-4 text-blue-200" : "w-9 h-9 mb-4 text-blue-700"} />
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-950"}`}>AI Workflow Audit</h3>
              <p className={`text-sm leading-relaxed mb-5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Paid 60-minute diagnostic session through OpenClaw Consulting.
              </p>
              <Link
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Book via OpenClaw
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.openclawconsulting.online/"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold ${isDark ? "text-blue-200 hover:text-white" : "text-blue-700 hover:text-blue-900"}`}
              >
                See OpenClaw first
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
