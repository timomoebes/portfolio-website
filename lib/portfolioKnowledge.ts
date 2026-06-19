export type PortfolioSource = {
  id: string
  title: string
  type: "proof" | "project" | "experience" | "principle" | "capability" | "cta"
  url?: string
  summary: string
  tags: string[]
}

export const portfolioKnowledge: PortfolioSource[] = [
  {
    id: "openclaw",
    title: "OpenClaw Consulting",
    type: "proof",
    url: "https://www.openclawconsulting.online/",
    summary:
      "OpenClaw is Timo's consulting direction for AI workflow audits, implementation scopes, lead handling, CRM enrichment, post-call execution, reporting loops, internal operations, and human-approved automation.",
    tags: ["openclaw", "consulting", "ai workflows", "automation", "crm", "reporting", "lead handling", "implementation"],
  },
  {
    id: "gym-near-me",
    title: "Gym Near Me Cyprus",
    type: "project",
    url: "https://gymnearme.cy/",
    summary:
      "Gym Near Me Cyprus is an AI-assisted local directory SaaS with business data enrichment, SEO structure, local search pages, full-stack deployment, and monetization logic for featured listings.",
    tags: ["gym near me", "cyprus", "saas", "directory", "seo", "monetization", "product", "data enrichment"],
  },
  {
    id: "doctolib-ai",
    title: "Doctolib AI Champion / Technical Services",
    type: "experience",
    summary:
      "Timo worked in healthcare SaaS technical services and AI champion work, including second-line support, SQL/Jira support operations, GDPR-aware agent workflows, and practical internal AI enablement.",
    tags: ["doctolib", "healthcare", "gdpr", "technical services", "ai champion", "support", "sql", "jira"],
  },
  {
    id: "onboarding-buddy",
    title: "Onboarding Buddy AI Agent",
    type: "project",
    summary:
      "Timo designed a Dust-powered onboarding assistant with four interconnected agents for HR, IT, culture, and role-specific guidance after the Dust AI Agents Hackathon in Paris.",
    tags: ["dust", "ai agents", "onboarding", "hr", "it", "context design", "compliance"],
  },
  {
    id: "ai-research-agent",
    title: "AI Research Agent",
    type: "project",
    url: "https://github.com/timomoebes/ai-research-agent-langgraph",
    summary:
      "An agentic research workflow using LangGraph, OpenAI, Firecrawl, and Pydantic for discovery, scraping, structured extraction, comparison, and recommendation output.",
    tags: ["ai research agent", "langgraph", "firecrawl", "pydantic", "structured extraction", "agent architecture"],
  },
  {
    id: "operating-principles",
    title: "Operating principles",
    type: "principle",
    summary:
      "Timo's AI systems principles: audit before automation, human approval beats blind autonomy, evidence over vibes, and ship thin, verify, then scale.",
    tags: ["principles", "audit", "human approval", "evidence", "verify", "scope", "automation"],
  },
  {
    id: "capabilities",
    title: "Capabilities",
    type: "capability",
    summary:
      "Timo builds AI workflow implementation, agent workflows, prompt/system design, CRM enrichment, reporting loops, Next.js/React products, TypeScript, Vercel, Supabase/SQL, SEO systems, APIs, Python, Node.js, Docker, Linux/Bash, documentation, QA logs, and client handoffs.",
    tags: ["capabilities", "skills", "typescript", "next.js", "python", "node", "supabase", "vercel", "apis", "qa", "documentation"],
  },
  {
    id: "background",
    title: "Background",
    type: "experience",
    summary:
      "Timo has 7+ years enterprise consulting and field support experience, a B.Eng. Health Electronics background, healthcare/regulated context, Google AI training, Metabase training, Python automation practice, and practical product-shipping experience.",
    tags: ["7+ years", "enterprise consulting", "field support", "health electronics", "engineering", "metabase", "google ai", "python"],
  },
]

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+äöüß\s-]/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2)

export function retrievePortfolioContext(query: string, limit = 5) {
  const queryTokens = tokenize(query)

  const scored = portfolioKnowledge.map((source) => {
    const haystack = tokenize([source.title, source.summary, source.tags.join(" ")].join(" "))
    const score = queryTokens.reduce((total, token) => {
      const directMatches = haystack.filter((item) => item.includes(token) || token.includes(item)).length
      return total + directMatches
    }, 0)

    const titleBoost = source.title.toLowerCase().includes(query.toLowerCase()) ? 4 : 0
    return { source, score: score + titleBoost }
  })

  const matches = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.source)

  return matches.length ? matches : portfolioKnowledge.slice(0, limit)
}
