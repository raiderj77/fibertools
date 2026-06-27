"use client";
import { useEffect, useRef } from "react";

export default function BeehiivSignup() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const attr = document.createElement("script");
    attr.src = "https://subscribe-forms.beehiiv.com/attribution.js";
    attr.async = true;
    document.head.appendChild(attr);

    const form = document.createElement("script");
    form.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    form.setAttribute("data-beehiiv-form", "5c8a2e2f-e544-4cc8-bcdd-2178a16214ec");
    form.async = true;
    ref.current.appendChild(form);
  }, []);

  return <div ref={ref} />;
}
