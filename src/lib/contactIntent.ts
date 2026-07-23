export const CONTACT_INTENT_EVENT = "upraiser-contact-intent";
const CONTACT_INTENT_STORAGE = "upraiser-contact-intent";

export function publishContactIntent(vertical: string) {
  sessionStorage.setItem(CONTACT_INTENT_STORAGE, vertical);
  window.dispatchEvent(new CustomEvent(CONTACT_INTENT_EVENT, { detail: vertical }));
}

export function consumeContactIntent() {
  const value = sessionStorage.getItem(CONTACT_INTENT_STORAGE);
  if (value) sessionStorage.removeItem(CONTACT_INTENT_STORAGE);
  return value;
}
