"use client";

export default function PrivacyChoicesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("fibertools:privacy-choices"))}
      className="text-sm text-cream-300 hover:text-amber-400 transition-colors block py-1"
    >
      Privacy choices
    </button>
  );
}
