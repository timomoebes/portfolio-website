"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { Github } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    title: "Simplify Yourself - Website Remake",
    tech: "HTML5, CSS3, JavaScript, Three.js, Progressive Web App (PWA), Git",
    description:
      "Transformed a dated WordPress minimalism blog into a modern, fast, and responsive web experience featuring dynamic content loading and interactive 3D visual effects. Implemented responsive design with modern UI/UX principles, interactive Three.js hero animations, and dynamic blog post loading with search functionality. Created PWA capabilities for offline access, custom favicon system with brand identity, and optimized performance with SEO improvements. The remake focuses on clean, intentional design that reflects minimalist philosophy while providing an engaging user experience across all devices.",
  },
  {
    title: "AI Research Agent",
    tech: "Python, LangGraph, OpenAI GPT-4, Firecrawl, Pydantic, REST APIs",
    githubUrl: "https://github.com/timomoebes/ai-research-agent-langgraph",
    description:
      "Developed an intelligent AI research agent that automatically discovers, analyzes, and compares developer tools and technologies through advanced web scraping and LLM-powered analysis. Built with a sophisticated multi-step workflow using LangGraph orchestration, featuring structured data extraction with Pydantic models, comprehensive web content analysis via Firecrawl API, and intelligent recommendation generation. The system demonstrates expertise in AI agent architecture, workflow automation, and enterprise-grade data processing pipelines with both simple CLI interfaces and advanced research capabilities.",
  },
  {
    title: "Interactive Portfolio Website",
    tech: "TypeScript, Next.js, React, Tailwind CSS, Framer Motion, Three.js, GenAI",
    description:
      "Developed a modern portfolio website featuring interactive 3D backgrounds, AI-powered chatbot, and innovative 2D-to-3D object generation technology. Implemented responsive design with dark mode support, smooth animations, and interactive project showcases. The site demonstrates expertise in modern web technologies and AI integration.",
  },
  {
    title: "Mobile Long Term ECG Monitoring Device",
    tech: "C / C++, ESP32, WiFi, MQTT, Autodesk Fusion 360, 3D printing",
    description:
      "Engineered a sophisticated mobile ECG monitoring solution combining hardware and software expertise. Implemented real-time data processing and wireless transmission using ESP32 and MQTT protocol. Utilized Agile methodology with Jira and Trello for project management. Created custom enclosure designs using Autodesk Fusion 360 and manufactured through 3D printing, demonstrating full-stack product development capabilities.",
  },
  {
    title: "Microcontroller System for Blood Pressure Measurement",
    tech: "C / C++, Arduino Mega 2560, Bluetooth",
    description:
      "Designed and implemented a comprehensive health monitoring system centered around blood pressure measurement. Developed an intuitive touchscreen interface for user interaction, integrated multiple sensor types including temperature and blood pressure sensors, and implemented Bluetooth connectivity for data transmission. The system provides accurate health metrics while maintaining user-friendly operation.",
  },
  {
    title: "3D Printer Monitoring and Control System",
    tech: "Raspberry Pi, OctoPrint, Linux",
    description:
      "Created a sophisticated 3D printer monitoring solution using Raspberry Pi and OctoPrint. Implemented remote control capabilities for print job management, integrated Pi camera for real-time visual monitoring, and developed custom safety measures including temperature monitoring and emergency shutdown procedures. The system enables efficient remote operation while ensuring safe and reliable 3D printing.",
  },
  {
    title: "Shopping System",
    tech: "C++",
    githubUrl: "https://github.com/timomoebes/SupermarketApp",
    description:
      "Developed a comprehensive supermarket management system showcasing object-oriented programming principles. Implemented features including inventory management, user authentication, shopping cart functionality, and persistent data storage. The console application demonstrates proficiency in C++ fundamentals, file I/O operations, and creating maintainable, structured code.",
  },
  {
    title: "PDF to MP3 Converter",
    tech: "Python",
    githubUrl: "https://github.com/timomoebes/Pdf2Audio",
    description:
      "Created an efficient document accessibility tool that converts PDF documents into audio format. Utilized PyPDF2 for robust PDF text extraction and pyttsx3 for high-quality text-to-speech conversion. The application supports various PDF formats and provides customizable voice output options, making written content accessible to visually impaired users or for convenient audio consumption.",
  },
  {
    title: "CAD 3D Design: Filament Holder for Desktop 3D Printer",
    tech: "Creo",
    description: "Designed a filament holder for Monoprice select mini desktop 3D printer using Creo software.",
  },
  {
    title: "Digital Clock Design",
    tech: "Logisim, MultiSIM",
    description:
      "Developed a digital clock with integrated circuits (ICs). Prototyped in MultiSIM and final installation on a breadboard. Studied logic gates and arithmetic elements, including 7 segment displays, counter, multiplexer, and more.",
  },
  {
    title: "Smart Contract on Ethereum Blockchain",
    tech: "Solidity, Ethereum",
    githubUrl: "https://github.com/timomoebes/my-first-own-cryptocurrency",
    description:
      "Developed a smart contract on the Ethereum Blockchain using the Solidity programming language, demonstrating practical experience in blockchain development.",
  },
]

export default function ProjectsSection({ id }: { id?: string }) {
  const { theme } = useTheme()

  return (
    <section
      id={id}
      className={`py-16 min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gradient-to-br from-yellow-900 to-red-900" : "bg-gradient-to-br from-yellow-50 to-red-50"
      }`}
    >
      <div className="container mx-auto px-4 py-16">
        <h2 className={`text-4xl font-bold mb-12 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                theme === "dark" ? "bg-white/10 hover:bg-white/[0.15]" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {project.title}
                </h3>
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-colors ${
                      theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
                    }`}
                  >
                    <Github className="w-5 h-5" />
                  </Link>
                )}
              </div>
              <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{project.tech}</p>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-700"}>{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
