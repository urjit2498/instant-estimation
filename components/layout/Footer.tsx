// TODO: replace with real business name/contact details once branding is finalized.
const SITE_NAME = "Instant Quote Engine";
// TODO: replace with the real company name powering this tool (e.g. your agency/product name).
const POWERED_BY = "ACME, Inc.";

export function Footer() {
  return (
    <footer className="border-t border-asphalt-200 bg-asphalt-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-asphalt-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <p>Powered by {POWERED_BY}</p>
      </div>
    </footer>
  );
}
