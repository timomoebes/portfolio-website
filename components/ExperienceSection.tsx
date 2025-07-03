"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useIsMobile } from "../hooks/use-mobile"

interface Experience {
  title: string
  company: string
  period: string
  description: string
  details: string[]
  technologies: string[]
}

const experiences: Experience[] = [
  {
    title: "Technical Services Engineer",
    company: "Doctolib",
    period: "Jul 2024 - today",
    description:
      "I work as an engineer in a second-layer support team, where I troubleshoot complex product issues, provide integration solutions to customers, and identify bugs while collaborating closely with developers to resolve them. I handle knowledge management, bug prioritization, and internal escalations. I enhance our support workflows by leveraging AI and prompt engineering techniques.",
    details: [
      "Investigating and resolving complex technical issues",
      "Providing comprehensive product guidance to clients",
      "Developing and maintaining support documentation",
      "Collaborating with development teams for product improvements",
    ],
    technologies: ["SQL", "JavaScript", "Troubleshooting", "Jira", "Asana", "GenAI"],
  },
  {
    title: "Onboarding Buddy AI Agent Developer",
    company: "Doctolib",
    period: "Apr 2025 - today",
    description:
      "Designed and implemented the Onboarding Buddy, an AI-driven assistant powered by Dust (dust.tt), to automate employee onboarding at Doctolib. The system uses 4 interconnected AI agents (HR Buddy, IT Helper, Culture Ambassador, Job-Specific Guide) to provide seamless guidance on HR policies, IT setup, company culture, and role-specific training. Inspired by participation in the first Dust AI Agents Hackathon (Paris, April 11, 2025), the project enhances onboarding efficiency while ensuring GDPR and HIPAA compliance.",
    details: [ 
      "Developed 4 specialized AI agents using Dust's no-code platform", 
      "Integrated agents for collaborative query handling and data access",
      "Ensured compliance with healthcare data privacy standards", 
    ], 
    technologies: ["Dust (dust.tt)", "No-Code AI", "Prompt Engineering", "Healthcare Compliance", "GenAI"]
  },
  {
    title: "Technical Consultant",
    company: "DTB Deutsche Technikberatung",
    period: "Apr 2019 - Aug 2024",
    description:
      "I provided comprehensive customer support both in the field and remotely, maintaining a NPS score of 91. My responsibilities included advising customers and assisting with smart home technology setup and configuration. I performed Calibration-as-a-Service using CalMan and managed scheduling through Salesforce. I supported colleagues by providing immediate assistance through Salesforce while handling administrative tasks during customer visits.",
    details: [
      "Provided expert technical support for smart home solutions",
      "Achieved consistently high customer satisfaction scores",
      "Resolved complex hardware and software issues",
      "Developed customer training materials",
    ],
    technologies: ["Smart Home Tech", "Networking", "Troubleshooting", "Windows", "UNIX", "GenAI"],
  },
  {
    title: "IT System Administrator & Software Developer",
    company: "adag",
    period: "Mar 2024 - Apr 2024",
    description:
      "I was responsible for maintaining and ensuring smooth operation of the IT infrastructure, focusing on consolidation and optimization of systems to enhance fail-safety and performance. I provided in-house support and maintenance of workstations, including setting up home office environments. I maintained system documentation while optimizing and developing Bash scripts to automate system processes. Additionally, I developed and maintained a PHP application using Laravel in VS Code.",
    details: [
      "Managed and maintained IT infrastructure",
      "Developed PHP applications with Laravel",
      "Implemented system automation solutions",
      "Improved system security and performance",
    ],
    technologies: ["PHP", "Bash", "SQL", "UNIX", "Docker"],
  },

  {
    title: "Bachelor Thesis",
    company: "3D-Medico",
    period: "May 2023 - Aug 2023",
    description:
      "Development and implementation of an embedded control system with graphical user interface for a tensile testing machine for 3D-printed materials.",
    details: [
      "Developed embedded control system",
      "Implemented graphical user interface",
      "Worked with tensile testing machine for 3D-printed materials",
    ],
    technologies: ["Python", "C++", "C", "Arduino", "Raspberry Pi", "Embedded Systems", "Linux"],
  },
  {
    title: "Intern",
    company: "Think3DDD",
    period: "Apr 2022 - Jul 2022",
    description:
      "Environmentally friendly 3D printing for orthopaedics and R&D. Focused on development, construction, and optimization of orthoses and shoe insoles using CAD software including Autodesk Fusion 360 and Blender.",
    details: [
      "Verified and improved product conformity with European Medical Device Regulation (MDR)",
      "Prepared and maintained technical documentation",
      "Executed software optimization pilot phases",
      "Participated in project teams for internal quality assurance",
    ],
    technologies: ["CAD", "Autodesk Fusion 360", "Blender", "3D Printing", "Python"],
  },
  {
    title: "Sports Player",
    company: "Decathlon Deutschland",
    period: "Nov 2018 - Apr 2019",
    description: "Worked as a sports player, focusing on customer service.",
    details: ["Provided excellent customer service", "Assisted customers with sports equipment selection"],
    technologies: ["Customer Service"],
  },
  {
    title: "Content Manager",
    company: "ZEPTER&KRONE",
    period: "Aug 2018 - Oct 2018",
    description: "Managed content for the company.",
    details: ["Created and curated content", "Managed content distribution channels"],
    technologies: ["Content Management", "Digital Marketing"],
  },
  {
    title: "Blogger and Educator",
    company: "Hinreisend: Travel Blog & Podcast",
    period: "Jul 2016 - Sep 2018",
    description: "Developed, implemented, and managed complex online projects for creating an online business.",
    details: [
      "Interviewed travelers from different countries through podcasts",
      "Analyzed competitor websites for keyword optimization",
      "Created various media content including photos and videos",
      "Developed email marketing campaigns using own funnel system",
      "Created landing pages with freebies for lead generation",
    ],
    technologies: ["Content Creation", "SEO", "Email Marketing", "Podcast Production"],
  },
  {
    title: "Event Marketing Manager",
    company: "IQPC Germany",
    period: "Oct 2017 - Jul 2018",
    description:
      "Worked across multiple industries including Energy, Finance, Automotive, Health IT, and Blockchain, focusing on data analysis and partnership management.",
    details: [
      "Engaged in sales operations and production processes",
      "Ensured successful event execution and stakeholder satisfaction",
    ],
    technologies: ["Event Marketing", "Data Analysis", "B2B Marketing"],
  },
  {
    title: "Social Media Marketing Consultant",
    company: "The Way Branding",
    period: "Apr 2017 - Jun 2017",
    description: "Managed Facebook and Instagram marketing campaigns for businesses in Aguascalientes, Central Mexico.",
    details: [
      "Created compelling ad copy and video content",
      "Provided sales and marketing support for product launches",
    ],
    technologies: ["Social Media Marketing", "Content Creation", "Video Production"],
  },
  {
    title: "Social Media Manager",
    company: "Concentus Holzskelett-haus GmbH",
    period: "Apr 2016 - Jun 2017",
    description: "Researched and created content to drive higher conversion rates and visitor traffic across channels.",
    details: [
      "Analyzed competitor websites to understand real estate market dynamics",
      "Utilized web analytics tools for audience behavior research",
      "Employed graphic design tools for property photo editing",
      "Wrote creative ad copy using targeted keywords",
    ],
    technologies: ["Social Media Management", "SEO", "Web Analytics", "Graphic Design"],
  },
  {
    title: "Assistant for media technology focus on video technology",
    company: "Oberstufenzentrum Kommunikations-, Informations-, und Medientechnik",
    period: "Sep 2008 - Jun 2012",
    description: "Gained extensive experience working with modern media in the online world.",
    details: [
      "Programmed web servers using HTML, CSS, Java, and SQL",
      "Developed skills in media and web design using Adobe software",
      "Learned camera work, storytelling, and media management",
      "Gained knowledge of signaling, analog and digital electronics",
    ],
    technologies: ["HTML", "CSS", "Java", "SQL", "Adobe Photoshop", "Adobe Lightroom", "Adobe Premiere"],
  },
]

export default function ExperienceSection({ id }: { id?: string }) {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)
  const [expandedExperiences, setExpandedExperiences] = useState(false)

  const visibleExperiences = expandedExperiences ? experiences : experiences.slice(0, 3)

  return (
    <section
      id={id}
      className={`min-h-screen flex items-center justify-center ${isMobile ? 'py-12 px-4' : 'py-16'}
        ${theme === "dark" ? "bg-gradient-to-br from-blue-900 to-green-900" : "bg-gradient-to-br from-blue-50 to-green-50"}
      `}
    >
      <div className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
        <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold ${isMobile ? 'mb-8' : 'mb-16'} text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Experience
        </h2>

        <div className="relative">
          {/* Timeline line - hidden on mobile for cleaner look */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200" />
          )}

          {visibleExperiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex items-center ${isMobile ? 'mb-6' : 'mb-16'}`}
            >
              {/* Timeline dot - only show on desktop */}
              {!isMobile && (
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500" />
              )}

              {/* Content card */}
              <motion.div
                className={`
                  ${isMobile 
                    ? 'w-full p-4 rounded-xl' 
                    : `w-5/12 p-6 rounded-lg ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`
                  }
                  cursor-pointer transform transition-all duration-300
                  ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-50 shadow-lg"}
                  ${selectedExp === exp ? "scale-105" : "hover:scale-102"}
                `}
                onClick={() => setSelectedExp(exp === selectedExp ? null : exp)}
              >
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"} leading-tight`}>
                  {exp.title}
                </h3>
                <h4 className={`${isMobile ? 'text-base' : 'text-lg'} mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-medium`}>
                  {exp.company}
                </h4>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} font-medium`}>
                  {exp.period}
                </p>
                <p className={`${isMobile ? 'text-sm leading-relaxed' : 'text-base'} mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {exp.description}
                </p>

                <AnimatePresence>
                  {selectedExp === exp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ul
                        className={`list-disc ${isMobile ? 'list-inside ml-2' : 'list-inside'} mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"} space-y-1`}
                      >
                        {exp.details.map((detail, i) => (
                          <li key={i} className={`${isMobile ? 'text-sm leading-relaxed' : 'text-base'}`}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <div className={`flex flex-wrap gap-2 ${isMobile ? 'mt-3' : ''}`}>
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className={`
                              ${isMobile ? 'text-xs px-2 py-1' : 'text-xs px-2 py-1'} rounded-full font-medium
                              ${theme === "dark" ? "bg-blue-500/20 text-blue-200" : "bg-blue-100 text-blue-800"}
                            `}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile indicator for expandable content */}
                {isMobile && (
                  <div className={`mt-3 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <ChevronDown className={`w-4 h-4 mx-auto transition-transform duration-200 ${selectedExp === exp ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {experiences.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setExpandedExperiences(!expandedExperiences)}
              className={`
                flex items-center gap-2 ${isMobile ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'} rounded-full transition-colors duration-200 font-medium
                ${
                  theme === "dark"
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }
              `}
            >
              {expandedExperiences ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
