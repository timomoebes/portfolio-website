"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { X } from "lucide-react"

interface Skill {
  name: string
  description: string
}

const skills: Skill[] = [
  {
    name: "C / C++",
    description:
      "Powerful, low-level programming languages used for system programming and performance-critical applications.",
  },
  {
    name: "Python",
    description: "High-level programming language known for its simplicity and extensive library ecosystem.",
  },
  {
    name: "Java",
    description:
      "Object-oriented programming language known for its platform independence and enterprise applications.",
  },
  {
    name: "HTML",
    description: "Standard markup language for creating web pages and web applications.",
  },
  {
    name: "CSS",
    description: "Style sheet language used for describing the presentation of HTML documents.",
  },
  {
    name: "XML",
    description: "Extensible markup language used for storing and transporting data.",
  },
  {
    name: "JavaScript",
    description: "High-level programming language essential for web development and interactive applications.",
  },
  {
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.",
  },
  {
    name: "SQL",
    description: "Standard language for storing, manipulating, and retrieving data in databases.",
  },
  {
    name: "Bash",
    description: "Unix shell and command language for system administration and automation.",
  },
  {
    name: "Linux",
    description: "Open-source operating system kernel used in various distributions and server environments.",
  },
  {
    name: "Jira",
    description: "Project management tool for agile teams and issue tracking.",
  },
  {
    name: "Git/GitHub",
    description: "Version control system and platform for collaborative software development.",
  },
  {
    name: "Docker",
    description: "Platform for developing, shipping, and running applications in containers.",
  },
  {
    name: "AWS",
    description: "Cloud computing platform offering various services for building scalable applications.",
  },
  {
    name: "VSCode",
    description: "Popular source-code editor with extensive plugin ecosystem.",
  },
  {
    name: "API",
    description: "Application Programming Interface for building and integrating software applications.",
  },
  {
    name: "Asana",
    description: "Project management tool for organizing and tracking team work.",
  },
]

interface SkillsProps {
  id?: string
}

export default function SkillsSection({ id }: SkillsProps) {
  const { theme } = useTheme()
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setSelectedSkill(null)
      }
    }

    if (selectedSkill) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedSkill])

  return (
    <section
      id={id}
      className={`py-16 min-h-screen flex items-center justify-center bg-gradient-to-br 
        ${theme === "dark" ? "from-green-900 to-yellow-900" : "from-green-100 to-yellow-100"}
      `}
    >
      <div className="container mx-auto px-4 py-16">
        <h2 className={`text-4xl font-bold mb-12 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => setSelectedSkill(skill)}
              className={`
                p-4 rounded-lg text-center cursor-pointer transition-all duration-300
                ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-50 shadow-md"}
                transform hover:scale-105
              `}
            >
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              ref={dialogRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`
                relative w-full max-w-md rounded-lg p-6
                ${theme === "dark" ? "bg-gray-900" : "bg-white"}
                shadow-xl
              `}
            >
              <button
                onClick={() => setSelectedSkill(null)}
                className={`
                  absolute right-4 top-4 p-1 rounded-full transition-colors
                  ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}
                `}
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className={`text-lg font-semibold mb-2 pr-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {selectedSkill.name}
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {selectedSkill.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
