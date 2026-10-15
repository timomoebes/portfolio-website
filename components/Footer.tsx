import BrandMark from "./BrandMark"
import { useTheme } from "./ThemeProvider"

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer
      className={`
      w-full py-4 text-center
      ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"}
    `}
    >
      <a href="#hero" aria-label="Timo Möbes — Home" className="mx-auto mb-3 flex h-[44px] w-[44px] items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"><BrandMark className="h-[28px] w-[28px]" /></a>
      <p className="text-sm">&copy; {new Date().getFullYear()} Timo Möbes. All rights reserved.</p>
    </footer>
  )
}
