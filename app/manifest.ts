import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Timo Möbes",
    short_name: "Timo Möbes",
    start_url: "/",
    display: "browser",
    background_color: "#101619",
    theme_color: "#101619",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  }
}
