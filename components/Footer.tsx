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
      <p className="text-sm">&copy; {new Date().getFullYear()} Timo Möbes. All rights reserved.</p>
    </footer>
  )
}
