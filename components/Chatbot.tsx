"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ExternalLink, Send, Sparkles, X } from "lucide-react"
import { useTheme } from "./ThemeProvider"

type Source = {
  id: string
  title: string
  type: string
  url?: string
}

type AgentCta = {
  label: string
  href: string
}

interface Message {
  text: string
  isUser: boolean
  sources?: Source[]
  cta?: AgentCta
}

interface ChatbotProps {
  initialMessage?: string | null
  showChatbot: boolean
  onClose: () => void
}

const starterActions = [
  {
    label: "Proof",
    prompt: "What has Timo actually built, and what is the strongest proof?",
  },
  {
    label: "Workflow audit",
    prompt:
      "I run a service business and lose leads across WhatsApp, email, and LinkedIn. What would Timo automate first?",
  },
  {
    label: "Technical depth",
    prompt: "What makes Timo's AI work more than a toy chatbot?",
  },
]

const defaultFollowUps = [
  "Why is Gym Near Me Cyprus relevant proof?",
  "How does OpenClaw connect to this portfolio?",
  "What workflow should not be automated yet?",
]

export default function Chatbot({ initialMessage, showChatbot, onClose }: ChatbotProps) {
  const { theme } = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Ask me about Timo's projects, AI workflow work, OpenClaw, Gym Near Me, or describe a messy workflow and I’ll suggest the first automation worth building.",
      isUser: false,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [followUps, setFollowUps] = useState(defaultFollowUps)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatboxRef = useRef<HTMLDivElement>(null)
  const handledInitialMessage = useRef<string | null>(null)

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  useEffect(() => {
    if (initialMessage && handledInitialMessage.current !== initialMessage) {
      handledInitialMessage.current = initialMessage
      void handleQuery(initialMessage)
    }
  }, [initialMessage])

  const handleQuery = async (query: string) => {
    const cleanQuery = query.trim()
    if (!cleanQuery || isLoading) return

    const nextMessages = [...messages, { text: cleanQuery, isUser: true }]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/portfolio-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanQuery, history: messages }),
      })

      const data = await response.json()

      if (!response.ok && !data?.answer) {
        throw new Error(data?.error || "Agent request failed")
      }

      setMessages((prev) => [
        ...prev,
        {
          text: data.answer,
          isUser: false,
          sources: data.sources || [],
          cta: data.cta,
        },
      ])

      if (Array.isArray(data.suggestedNextQuestions) && data.suggestedNextQuestions.length > 0) {
        setFollowUps(data.suggestedNextQuestions.slice(0, 3))
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "The live portfolio agent hit a temporary error. Try again, or ask about OpenClaw, Gym Near Me Cyprus, Doctolib, or a messy workflow you want to automate.",
          isUser: false,
          cta: { label: "Work with me through OpenClaw", href: "https://www.openclawconsulting.online/" },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault()
    void handleQuery(input)
  }

  const isDark = theme === "dark"

  return (
    <div
      ref={chatboxRef}
      className={`w-full max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
        isDark ? "bg-slate-950/95 border border-white/15" : "bg-white border border-slate-200"
      }`}
    >
      <div className={`px-4 py-3 border-b flex items-start justify-between gap-3 ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className={isDark ? "w-4 h-4 text-blue-300" : "w-4 h-4 text-blue-600"} />
            <h3 className={`font-bold ${isDark ? "text-white" : "text-slate-950"}`}>Ask Timo's Portfolio Agent</h3>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Grounded in portfolio context. Do not paste secrets or private data.
          </p>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-grow overflow-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.text}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-2xl ${
                  message.isUser
                    ? "bg-blue-600 text-white"
                    : isDark
                      ? "bg-white/10 text-slate-100 border border-white/10"
                      : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>

                {!message.isUser && message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {message.sources.slice(0, 4).map((source) =>
                      source.url ? (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                            isDark ? "bg-blue-400/15 text-blue-100 hover:bg-blue-400/25" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          {source.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span
                          key={source.id}
                          className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${
                            isDark ? "bg-white/10 text-slate-200" : "bg-white text-slate-700"
                          }`}
                        >
                          {source.title}
                        </span>
                      ),
                    )}
                  </div>
                )}

                {!message.isUser && message.cta && (
                  <a
                    href={message.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    {message.cta.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-3 py-2 text-sm ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
              Reading portfolio context… mapping the practical answer…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`px-4 py-3 border-t space-y-3 ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div>
          <p className={`text-xs font-semibold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Try this:</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {starterActions.map((action) => (
              <button
                key={action.label}
                onClick={() => void handleQuery(action.prompt)}
                disabled={isLoading}
                className={`text-left text-xs px-3 py-2 rounded-xl transition-colors ${
                  isDark ? "bg-white/10 text-slate-200 hover:bg-white/15" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {followUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {followUps.map((question) => (
              <button
                key={question}
                onClick={() => void handleQuery(question)}
                disabled={isLoading}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                } disabled:opacity-50`}
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className={`p-4 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about Timo, or describe a messy workflow..."
            maxLength={1200}
            className={`flex-grow min-w-0 px-3 py-2 text-sm rounded-xl transition-colors ${
              isDark
                ? "bg-white/10 text-white placeholder-slate-400 focus:bg-white/15"
                : "bg-slate-100 text-slate-900 placeholder-slate-500 focus:bg-slate-50"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
