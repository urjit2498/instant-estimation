import type { MetadataRoute } from "next";

// TODO: replace name/colors/icons with real branding, and add real 192x192 / 512x512 PNG icons.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Instant Quote Engine",
    short_name: "Instant Quote",
    description: "Instant driveway sealcoating price estimates.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#17181c",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
