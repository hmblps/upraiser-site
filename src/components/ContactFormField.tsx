import { cloneElement, useEffect, useRef, useState, type ReactElement, type HTMLAttributes } from "react";
import { BorderBeam } from "./BorderBeam";
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
      <label htmlFor={id} className="mb-1 block text-sm font-semibold flex-none">
        {label}
      </label>
      <div
        ref={wrapRef}
        className={`contact-field-wrap strip-beam-wrap relative overflow-hidden rounded-xl${error ? " contact-field-wrap--invalid" : ""}${showBeam ? " contact-field-wrap--beam" : ""}${expand ? " flex-1 flex flex-col min-h-0" : ""}`}
      >
        {showBeam ? (
          <BorderBeam
            duration={5.5}
            size={200}
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
      {error ? (
        <p id={`${id}-error`} className="mt-1 flex-none text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
