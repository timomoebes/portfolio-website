import { motion } from "framer-motion"

const education = [
  {
    title: "Databases and SQL for data processing with Python",
    institution: "IBM",
    status: "In Progress",
    description:
      "Learning to create relational databases, construct SQL queries, and work with advanced SQL techniques.",
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
    title: "Python Programming Certificate of Achievement",
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
