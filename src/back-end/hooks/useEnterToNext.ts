import { useCallback } from "react";

export function useEnterToNext() {
  return useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const tag = target.tagName;
    if (tag === "TEXTAREA") return;
    if (tag !== "INPUT" && tag !== "SELECT") return;

    const input = target as HTMLInputElement;
    if (input.type === "submit") return;

    const form = e.currentTarget;
    const focusables = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      const disabled =
        el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
      return !disabled && !el.hasAttribute("hidden");
    });

    const index = focusables.indexOf(target);
    if (index === -1) return;

    e.preventDefault();
    const next = focusables[index + 1] ?? focusables[0];
    next.focus();
  }, []);
}
