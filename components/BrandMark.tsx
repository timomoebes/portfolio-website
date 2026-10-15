export default function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="8 8 84 84" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d="M8 8H92V24H58V42H42V24H8Z" />
      <path d="M8 92V38H24L50 65L76 38H92V92H76V61L50 87L24 61V92Z" />
    </svg>
  )
}
