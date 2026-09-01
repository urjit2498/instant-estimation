import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Matches the "IQ" logomark used in the site header (deep-blue-to-cyan gradient tile, white initials).
// TODO: replace with a real logo mark once branding is finalized.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 55%, #22d3ee 100%)",
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 17,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        IQ
      </div>
    ),
    { ...size }
  );
}
