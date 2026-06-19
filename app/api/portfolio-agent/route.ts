import { NextRequest, NextResponse } from "next/server"
import { retrievePortfolioContext, type PortfolioSource } from "@/lib/portfolioKnowledge"

type ChatMessage = {
  text: string
  isUser: boolean
}

type AgentResponse = {
  answer: string
  sources: Pick<PortfolioSource, "id" | "title" | "type" | "url">[]
  suggestedNextQuestions: string[]
  cta?: {
    label: string
    href: string
  }
}

const MODEL = "gemini-2.5-flash"
const BOOKING_URL = "https://app.cal.eu/openclawconsulting/ai-workflow-audit"

const systemPrompt = `You are Timo Möbes' portfolio agent.

Your job:
- Answer questions about Timo's work, projects, capabilities, and operating style.
- Use only the supplied portfolio context.
- Be concise, specific, and commercially useful.
- Never invent employers, metrics, clients, certifications, revenue, or project outcomes.
- If the visitor asks about hiring, implementation, or a business workflow, route them to OpenClaw where useful.
- If the visitor describes a workflow problem, give a short first-pass automation recommendation.

Tone:
Direct, practical, premium, not corporate, not hype.

Safety:
- If context does not support the answer, say what is known and what is not known.
- Tell users not to paste secrets, passwords, private health data, or confidential client data.
- Do not give legal, medical, or financial advice.

Return strict JSON only. No markdown. Use this shape:
{
  "answer": "string",
  "suggestedNextQuestions": ["string", "string", "string"],
  "cta": null
}

When a booking or implementation next step is appropriate, use:
"cta": { "label": "Book an AI Workflow Audit", "href": "https://app.cal.eu/openclawconsulting/ai-workflow-audit" }`

const defaultFollowUps = [
  "What has Timo actually built?",
  "Why is Gym Near Me Cyprus relevant proof?",
  "I lose leads across WhatsApp and email. What would Timo automate first?",
]

function getGeminiApiKey() {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}

function extractJson(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "")
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
}

function toSources(context: PortfolioSource[]) {
  return context.map(({ id, title, type, url }) => ({ id, title, type, url }))
}

function buildStaticAnswer(message: string, context: PortfolioSource[]): AgentResponse {
  const sources = toSources(context)
  const lowerMessage = message.toLowerCase()
  const isWorkflowQuestion = ["workflow", "lead", "crm", "whatsapp", "email", "follow", "automate", "automation", "business", "client"].some(
    (word) => lowerMessage.includes(word),
  )

  if (isWorkflowQuestion) {
    return {
      answer:
        "First automation worth exploring: capture the messy inputs into one lead/workflow table, classify urgency and next step, draft the follow-up, then keep human approval before anything gets sent. The useful system is not a fully autonomous bot; it is a thin evidence loop that stops context from getting lost.",
      sources,
      suggestedNextQuestions: [
        "What should stay manual in this workflow?",
        "How would OpenClaw scope this first?",
        "What proof shows Timo can build this?",
      ],
      cta: {
        label: "Book an AI Workflow Audit",
        href: BOOKING_URL,
      },
    }
  }

  return {
    answer: `The strongest relevant proof here is ${context
      .slice(0, 3)
      .map((item) => item.title)
      .join(", ")}. ${context[0]?.summary || "Timo's portfolio connects AI workflow implementation, product shipping, and operational discipline."}`,
    sources,
    suggestedNextQuestions: [
      "Why is Gym Near Me Cyprus relevant proof?",
      "How does OpenClaw connect to this portfolio?",
      "What has Timo actually built?",
    ],
  }
}

function buildPrompt(message: string, history: ChatMessage[], context: PortfolioSource[]) {
  const recentHistory = history
    .slice(-6)
    .map((item) => `${item.isUser ? "Visitor" : "Agent"}: ${item.text}`)
    .join("\n")

  return `Portfolio context:\n${JSON.stringify(context, null, 2)}\n\nRecent conversation:\n${recentHistory || "No prior messages."}\n\nVisitor message:\n${message}\n\nAnswer from the context. If the visitor describes a workflow problem, provide a useful first automation recommendation with human approval and evidence checks.`
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = getGeminiApiKey()
    const body = await request.json()
    const message = String(body?.message || "").trim()
    const history = Array.isArray(body?.history) ? (body.history as ChatMessage[]) : []

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (message.length > 1200) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 })
    }

    const context = retrievePortfolioContext(message)

    if (!apiKey) {
      return NextResponse.json(buildStaticAnswer(message, context), { status: 200 })
    }

    const prompt = buildPrompt(message, history, context)

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 900,
            responseMimeType: "application/json",
          },
        }),
      },
    )

    if (!geminiResponse.ok) {
      console.error("Portfolio agent Gemini error", geminiResponse.status)
      return NextResponse.json(buildStaticAnswer(message, context), { status: 200 })
    }

    const result = await geminiResponse.json()
    const text = result?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("\n") || ""
    const parsed = extractJson(text)

    if (!parsed?.answer) {
      console.error("Portfolio agent parse error")
      return NextResponse.json(buildStaticAnswer(message, context), { status: 200 })
    }

    const response: AgentResponse = {
      answer: String(parsed.answer).slice(0, 4000),
      sources: toSources(context),
      suggestedNextQuestions: Array.isArray(parsed.suggestedNextQuestions)
        ? parsed.suggestedNextQuestions.slice(0, 3).map((item: unknown) => String(item).slice(0, 140))
        : defaultFollowUps,
      cta: parsed.cta?.label && parsed.cta?.href ? parsed.cta : undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Portfolio agent error", error)
    return NextResponse.json(
      buildStaticAnswer("workflow automation", retrievePortfolioContext("workflow automation")),
      { status: 200 },
    )
  }
}
