import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// TODO: replace with a real logo mark once branding is finalized.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#17181c",
          color: "#ff4b1f",
          fontSize: 92,
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
