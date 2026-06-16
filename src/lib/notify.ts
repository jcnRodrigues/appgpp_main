export type NotifyType = "sucesso" | "erro" | "aviso";

function normalizeMessage(message: unknown) {
  if (message === null || message === undefined) return "";
  if (typeof message === "string") return message;
  try {
    return JSON.stringify(message, null, 2);
  } catch {
    return String(message);
  }
}

export function notify(type: NotifyType, message: unknown, title?: string) {
  if (typeof window !== "undefined" && typeof window.systemAlert === "function") {
    window.systemAlert(type, normalizeMessage(message), title);
    return;
  }

  if (typeof window !== "undefined") {
    window.alert(normalizeMessage(message));
  }
}

