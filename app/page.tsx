"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/ThemeProvider"
import { useState } from "react"

const Navigation = dynamic(() => import("@/components/Navigation"))
const HeroSection = dynamic(() => import("@/components/HeroSection"))
const AboutSection = dynamic(() => import("@/components/AboutSection"))
const ExperienceSection = dynamic(() => import("@/components/ExperienceSection"))
const SkillsSection = dynamic(() => import("@/components/SkillsSection"))
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"))
const EducationSection = dynamic(() => import("@/components/EducationSection"))
const Footer = dynamic(() => import("@/components/Footer"))
const BackToTop = dynamic(() => import("@/components/BackToTop"))

export default function Home() {
  const [chatQuery, setChatQuery] = useState<string | null>(null)

  // Web Vitals integration removed due to build errors; consider using Next.js metrics in future

  return (
    <ThemeProvider>
      <main className="bg-background text-foreground min-h-screen flex flex-col">
        <Navigation />
        <div className="relative z-10 flex-grow">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <HeroSection chatQuery={chatQuery} />
            <AboutSection id="about" />
            <ExperienceSection id="experience" />
            <SkillsSection id="skills" onChatQuery={setChatQuery} />
            <ProjectsSection id="projects" />
            <EducationSection id="education" />
          </motion.div>
        </div>
        <Footer />
        <BackToTop />
      </main>
    </ThemeProvider>
  )
}
