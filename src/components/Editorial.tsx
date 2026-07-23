import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

type EditorialStackProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Hairline editorial list — default container for non-interactive info. */
export const EditorialStack = forwardRef<HTMLDivElement, EditorialStackProps>(
  function EditorialStack({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("editorial-stack", className)} {...rest}>
        {children}
      </div>
    );
  },
);

type EditorialItemProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "article";
  variant?: "default" | "step" | "split";
  step?: string;
  children: ReactNode;
};

export function EditorialItem({
  as: Tag = "div",
  variant = "default",
  step,
  className,
  children,
  ...rest
}: EditorialItemProps) {
  const isStep = variant === "step";

  return (
    <Tag
      className={cn(
        "editorial-item",
        isStep && "editorial-item--step",
        variant === "split" && "editorial-item--split",
        className,
      )}
      {...rest}
    >
      {isStep && step ? (
        <>
          <span className="editorial-step-num" aria-hidden>
            {step}
          </span>
          <div className="min-w-0">{children}</div>
        </>
      ) : (
        children
      )}
    </Tag>
  );
}
