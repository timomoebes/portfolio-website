import { motion } from "framer-motion"

const education = [
  {
    title: "Metabase Training - Explorer & Creator",
    institution: "Metabase",
    date: "03/2025",
    description:
      "Demonstrates advanced proficiency in Metabase for data exploration, dashboard creation, and effective data storytelling.",
  },
  {
    title: "Google Prompting Essentials",
    institution: "Google",
    date: "03/2025",
    description: "Adapted the art of prompt engineering by learning Google's five-step process to write clear, specific, and effective instructions for generative AI, enhancing productivity and achieving superior results from AI models.",
    skills: ["Prompt Engineering", "Generative AI", "Problem Solving"]
  },
  {
    title: "AI Essentials for Tech - Certification",
    institution: "Doctolib",
    date: "02/2025",
    description: "Acquired a foundational understanding of how AI is responsibly applied within the Doctolib ecosystem to enhance healthcare solutions, covering patient data privacy, AI-powered medical assistants, and the integration of technologies like Azure AI.",
    skills: ["Artificial Intelligence (AI)", "Deep Learning", "AI Systems"]
  },
  {
    title: "Introduction to Generative AI",
    institution: "Google Cloud",
    date: "12/2024",
    description: "Learned about generative AI, its workings, types of models, and applications.",
  },
  {
    title: "Bachelor of Engineering in Health Electronics",
    institution: "Berlin University of Applied Sciences",
    period: "10/2018 - 09/2023",
    description:
      "Gained broad knowledge in natural and engineering sciences, particularly in electrical engineering, microelectronics, and computer science.",
  },
  {
    title: "Python Programming Certificate",
    institution: "Mimo",
    date: "07/2022",
    description: "Developed a thorough understanding of Python syntax and problem-solving strategies.",
  },
]

export default function EducationSection({ id }: { id?: string }) {
  return (
    <section
      id={id}
      className="py-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-purple-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Education</h2>
        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-2">{edu.title}</h3>
              <h4 className="text-xl mb-2">{edu.institution}</h4>
              <p className="text-gray-300 mb-4">{edu.period || edu.date || edu.status}</p>
              <p>{edu.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
