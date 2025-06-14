import { motion } from "framer-motion"

export default function AboutSection({ id }: { id?: string }) {
  return (
    <section
      id={id}
      className={`py-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center p-8"
      >
        <h2 className="text-4xl font-bold mb-4">About Me</h2>
        <p className="text-xl max-w-2xl mx-auto">
          Healthcare technology professional who rapidly transitioned into AI engineering, 
achieving measurable production results (40% efficiency improvements) in my first 
year working with enterprise AI systems. Unique combination of medical device 
experience and modern AI development capabilities.
        </p>
      </motion.div>
    </section>
  )
}
