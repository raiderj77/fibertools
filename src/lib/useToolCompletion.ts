"use client";

import { useEffect, useRef } from "react";
import { detectGPCClient } from "@/lib/gpc";
import {
  createToolCompletionTracker,
  shouldStartToolCompletionTracker,
} from "@/lib/tool-completion-tracker.mjs";

export default function useToolCompletion(
  toolSlug: string,
  resultMarker: unknown,
  eligible = resultMarker !== null && resultMarker !== undefined,
) {
  const initialResult = useRef(resultMarker);
  const sent = useRef(false);

  useEffect(() => {
    if (!shouldStartToolCompletionTracker({
      sent: sent.current,
      eligible,
      initialResult: initialResult.current,
      resultMarker,
    })) {
      return;
    }

    const tracker = createToolCompletionTracker({
      toolSlug,
      storage: {
        getItem: (key: string) => window.localStorage.getItem(key),
      },
      getGpcActive: () => detectGPCClient(),
      getGtag: () => window.gtag,
      addEventListener: (name: string, listener: EventListener) =>
        window.addEventListener(name, listener),
      removeEventListener: (name: string, listener: EventListener) =>
        window.removeEventListener(name, listener),
      setIntervalFn: (callback: () => void, delay: number) =>
        window.setInterval(callback, delay),
      clearIntervalFn: (timerId: number) => window.clearInterval(timerId),
      onSent: () => {
        sent.current = true;
      },
    });

    return () => tracker.dispose();
  }, [eligible, resultMarker, toolSlug]);
}
