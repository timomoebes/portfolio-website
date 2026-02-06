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
          Healthcare technology professional who transitioned into AI engineering, bringing medical device precision to enterprise systems development. Within the first year, delivered significant performance gains—driving efficiency improvements that transformed operational workflows at scale. This unique blend of regulated engineering experience and modern AI capabilities enables a distinctive approach to building reliable, production-ready solutions that bridge technical innovation with real-world impact.
        </p>
      </motion.div>
    </section>
  )
}
