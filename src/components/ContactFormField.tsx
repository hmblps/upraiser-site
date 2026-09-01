import { cloneElement, useEffect, useRef, useState, type ReactElement, type HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { useReducedMotion } from "../hooks/useReducedMotion";

type ContactFormFieldProps = {
  label: string;
  id: string;
  error?: string;
  disabled?: boolean;
  expand?: boolean;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
};

export function ContactFormField({ label, id, error, disabled, expand, children }: ContactFormFieldProps) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onFocusIn = () => setFocused(true);
    const onFocusOut = (event: FocusEvent) => {
      if (!el.contains(event.relatedTarget as Node)) setFocused(false);
    };

    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const showBeam = focused && !reduced && !disabled;

  return (
    <div className={expand ? "flex-1 flex flex-col min-h-0" : ""}>
      <label htmlFor={id} className="stat-label mb-1 block flex-none">
        {label}
      </label>
      <div
        ref={wrapRef}
        className={`contact-field-wrap strip-beam-wrap relative overflow-hidden rounded-xl${error ? " contact-field-wrap--invalid" : ""}${showBeam ? " contact-field-wrap--beam" : ""}${expand ? " flex-1 flex flex-col min-h-0" : ""}`}
      >
        {showBeam ? (
          <GradientTraceBorder
            duration={2.4}
            strokeWidth={1.5}
            colorFrom="var(--theme-accent)"
            colorTo="var(--theme-accent-secondary)"
          />
        ) : null}
        {cloneElement(children, {
          id,
          disabled,
          className: `contact-field${expand ? " h-full flex-1 resize-none" : ""}`,
          ...(error
            ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
            : {}),
        } as Record<string, unknown>)}
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "0.25rem" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="text-caption flex-none text-magenta-light overflow-hidden"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
