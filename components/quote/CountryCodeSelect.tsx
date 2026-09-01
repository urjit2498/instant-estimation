"use client";

import { COUNTRY_PHONE_CONFIGS, getCountryByIso2 } from "@/lib/phone/countries";
import { countryFlagUrl } from "@/lib/phone/flag";
import { useEffect, useId, useRef, useState } from "react";

const inputClass =
  "w-full rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50";

interface CountryCodeSelectProps {
  value: string;
  onChange: (iso2: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

export function CountryCodeSelect({ value, onChange, disabled, invalid }: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const country = getCountryByIso2(value);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectCountry(iso2: string) {
    onChange(iso2);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="phone-country"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputClass} flex w-[6.75rem] items-center gap-2 pr-8`}
      >
        <img
          src={countryFlagUrl(country.iso2)}
          alt=""
          width={24}
          height={18}
          className="h-[18px] w-6 shrink-0 rounded-sm object-cover"
          loading="lazy"
        />
        <span className="font-medium">+{country.dialCode}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-asphalt-300"
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Country code"
          className="absolute left-0 top-[calc(100%+0.25rem)] z-20 max-h-60 w-64 overflow-y-auto rounded-md border border-asphalt-200 bg-paper-raised py-1 shadow-lg"
        >
          {COUNTRY_PHONE_CONFIGS.map((c) => {
            const selected = c.iso2 === value;
            return (
              <li key={c.iso2} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => selectCountry(c.iso2)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-asphalt-50 ${
                    selected ? "bg-asphalt-50 font-medium text-asphalt-950" : "text-asphalt-700"
                  }`}
                >
                  <img
                    src={countryFlagUrl(c.iso2)}
                    alt=""
                    width={24}
                    height={18}
                    className="h-[18px] w-6 shrink-0 rounded-sm object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-asphalt-300">+{c.dialCode}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
