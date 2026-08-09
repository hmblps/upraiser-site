import React from "react";

export function formatEventNames(text: string): React.ReactNode {
  if (!text) return text;
  
  const words = [
    "first_deposit_complete",
    "subscription_started",
    "registration_success",
    "level_achieved",
    "trial_started",
  ];
  
  // Create a safe regex to match any of the event names
  const regex = new RegExp(`(${words.join("|")})`, "g");
  const parts = text.split(regex);
  
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        words.includes(part) ? (
          <span key={i} className="font-bold text-magenta">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
