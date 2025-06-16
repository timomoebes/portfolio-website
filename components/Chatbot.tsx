"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { X } from "lucide-react"

interface Message {
  text: string
  isUser: boolean
}

interface QnA {
  question: string
  answer: string
}

const preloadedQnA: QnA[] = [
  {
    question: "What are your main areas of expertise?",
    answer:
      "My main areas of expertise include software development, technical support, and IT infrastructure management. I'm particularly skilled in languages like Python, C++, and JavaScript, and have experience with cloud platforms like AWS.",
  },
  {
    question: "Can you tell me about your most challenging project?",
    answer:
      "One of my most challenging projects was developing a mobile ECG monitoring device. It required integrating complex hardware with software, ensuring real-time data processing, and maintaining high accuracy.",
  },
  {
    question: "How do you stay updated with the latest technologies?",
    answer:
      "I stay updated through online courses, tech blogs, webinars, and participating in coding challenges. I'm also part of several developer communities where we discuss emerging technologies.",
  },
  {
    question: "What's your approach to problem-solving?",
    answer:
      "My approach involves breaking down complex issues into manageable parts, gathering information, and systematically testing solutions. I believe in collaborating with team members and leveraging collective knowledge.",
  },
  {
    question: "How do you handle working in a team?",
    answer:
      "I thrive in team environments. I believe in open communication, respecting diverse perspectives, and contributing to a positive team culture. I'm comfortable both leading projects and supporting others.",
  },
]

interface ChatbotProps {
  initialMessage?: string | null
  showChatbot: boolean
  onClose: () => void
}

export default function Chatbot({ initialMessage, showChatbot, onClose }: ChatbotProps) {
  const { theme } = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm Timo's virtual assistant. Feel free to ask me anything about Timo's experience, skills, or projects!",
      isUser: false,
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatboxRef = useRef<HTMLDivElement>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<QnA[]>([])

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (showChatbot) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showChatbot, onClose])

  useEffect(() => {
    if (showChatbot) {
      setSuggestedQuestions(getRandomQuestions(3))
    }
  }, [showChatbot])

  useEffect(() => {
    if (initialMessage) {
      handleQuery(initialMessage)
    }
  }, [initialMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, []) //Corrected dependency array

  const getRandomQuestions = (count: number) => {
    const shuffled = [...preloadedQnA].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const handleQuery = (query: string) => {
    const matchedQnA = preloadedQnA.find((qa) => qa.question.toLowerCase() === query.toLowerCase())

    if (matchedQnA) {
      setMessages((prev) => [...prev, { text: query, isUser: true }, { text: matchedQnA.answer, isUser: false }])
    } else {
      setMessages((prev) => [
        ...prev,
        { text: query, isUser: true },
        {
          text: "I'm sorry, I don't have a specific answer for that question. Is there anything else I can help you with?",
          isUser: false,
        },
      ])
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleQuery(input)
      setInput("")
    }
  }

  return (
    <div
      ref={chatboxRef}
      className={`
        w-full h-[480px] rounded-lg shadow-lg flex flex-col
        ${theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"}
      `}
    >
      {/* Header */}
      <div
        className={`
          px-4 py-3 border-b flex items-center justify-between
          ${theme === "dark" ? "border-gray-800" : "border-gray-200"}
        `}
      >
        <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Chat with Timo's Assistant
        </h3>
        <button
          onClick={onClose}
          className={`
            p-1 rounded-full transition-colors
            ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}
          `}
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] p-3 rounded-lg
                  ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-100 text-gray-900"
                  }
                `}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div
        className={`
          px-4 py-2 border-t
          ${theme === "dark" ? "border-gray-800" : "border-gray-200"}
        `}
      >
        <p className={`text-xs mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Suggested questions:</p>
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.map((qa, index) => (
            <button
              key={index}
              onClick={() => handleQuery(qa.question)}
              className={`
                text-xs px-2 py-1 rounded-full transition-colors
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {qa.question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={`
              flex-grow px-3 py-2 text-sm rounded-lg transition-colors
              ${
                theme === "dark"
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-50"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                input.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
