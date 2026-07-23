import { useEffect, useId, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/cn";

/** Future i18n locales — UI stub only (no routing / dictionaries yet). */
export const localeOptions = [
  { code: "en", label: "English", native: "English" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "ar", label: "Arabic", native: "العربية" },
] as const;

export type LocaleCode = (typeof localeOptions)[number]["code"];

/** Header language control — English active; others marked Coming soon. */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const reduced = useReducedMotion();
  const current = localeOptions[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("locale-switcher relative", className)}>
      <motion.button
        type="button"
        className="locale-switcher__trigger inline-flex items-center"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language: ${current.label}. Localization coming soon.`}
        whileHover={reduced ? undefined : { scale: 1.04 }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        onClick={() => setOpen((v) => !v)}
      >
        <Languages className="h-3.5 w-3.5 opacity-70" strokeWidth={2} aria-hidden />
        <span>{current.code}</span>
        <span aria-hidden className="text-[0.6rem] opacity-45">
          ▾
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Languages"
            className="locale-switcher__menu"
            initial={reduced ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            {localeOptions.map((locale) => {
              const active = locale.code === current.code;
              return (
                <li key={locale.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    disabled={!active}
                    className={cn("locale-switcher__item", active && "locale-switcher__item--active")}
                    title={active ? "Current language" : "Coming soon"}
                    onClick={() => {
                      if (active) setOpen(false);
                    }}
                  >
                    <span>
                      <span className="block leading-tight text-fg">{locale.native}</span>
                      <span className="text-micro text-muted">{locale.label}</span>
                    </span>
                    <span className="text-micro shrink-0 uppercase tracking-wide text-muted">
                      {active ? "On" : "Soon"}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
