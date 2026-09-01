import type { NextConfig } from "next";

/**
 * Content-Security-Policy allowlist is scoped to what the Google Maps JS API (map tiles,
 * Places Autocomplete, Geocoding) actually needs. 'unsafe-eval' and 'unsafe-inline' are required
 * by the Maps JS API itself (documented Google requirement, not a shortcut we chose) — narrow
 * this further only if Google tightens their own requirements.
 *
 * TODO: once contractor widgets need to be embedded in an <iframe> on a contractor's own
 * website, revisit X-Frame-Options (currently SAMEORIGIN) and add a `frame-ancestors` CSP
 * directive allowing only known contractor domains — do not open this up to "*".
 * TODO: once the Supabase save/email API exists, add its origin to connect-src (or keep it
 * same-origin via a Next.js Route Handler proxy, as the current mock API routes already do).
 */
// CSP allowlist follows Google's Maps JS API guidance — satellite tiles load from *.googleapis.com
// and *.google.com, not just maps.googleapis.com / maps.gstatic.com.
// https://developers.google.com/maps/documentation/javascript/content-security-policy
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://*.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://flagcdn.com https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.googleusercontent.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.google.com data: blob:",
  "frame-src 'self' https://*.google.com",
  "worker-src blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@react-google-maps/api"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
