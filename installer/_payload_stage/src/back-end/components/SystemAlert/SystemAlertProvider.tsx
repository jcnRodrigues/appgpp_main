"use client"

import * as React from "react"
import AlertaDialogo, {
  type AlertaDialogoTipo,
} from "@/back-end/components/AlertDialog/AlertaDialogo"

type AlertPayload = {
  type: AlertaDialogoTipo
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

type SystemAlertFn = (
  type: Exclude<AlertaDialogoTipo, "confirmacao">,
  message: unknown,
  title?: string
) => void

type SystemConfirmFn = (
  message: unknown,
  title?: string,
  options?: { confirmText?: string; cancelText?: string }
) => Promise<boolean>

declare global {
  interface Window {
    systemAlert?: SystemAlertFn
    systemConfirm?: SystemConfirmFn
  }
}

export default function SystemAlertProvider() {
  const [open, setOpen] = React.useState(false)
  const [payload, setPayload] = React.useState<AlertPayload>({
    type: "aviso",
    title: "Atenção",
    message: "",
  })
  const confirmResolver = React.useRef<((value: boolean) => void) | null>(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const originalAlert = window.alert

    const normalizeMessage = (message?: unknown) => {
      if (message === null || message === undefined) return ""
      if (typeof message === "string") return message
      return JSON.stringify(message, null, 2)
    }

    const systemAlert: SystemAlertFn = (type, message, title) => {
      const normalized = normalizeMessage(message)
      confirmResolver.current = null
      setPayload({
        type,
        title,
        message: normalized,
      })
      setOpen(true)
    }

    const systemConfirm: SystemConfirmFn = (message, title, options) =>
      new Promise((resolve) => {
        const normalized = normalizeMessage(message)
        confirmResolver.current = resolve
        setPayload({
          type: "confirmacao",
          title,
          message: normalized,
          confirmText: options?.confirmText,
          cancelText: options?.cancelText,
        })
        setOpen(true)
      })

    window.systemAlert = systemAlert
    window.systemConfirm = systemConfirm
    window.alert = (message?: unknown) => {
      systemAlert("aviso", message, "Atenção")
    }

    return () => {
      window.alert = originalAlert
      window.systemAlert = undefined
      window.systemConfirm = undefined
    }
  }, [])

  const handleConfirm = () => {
    if (confirmResolver.current) {
      confirmResolver.current(true)
      confirmResolver.current = null
    }
  }

  const handleCancel = () => {
    if (confirmResolver.current) {
      confirmResolver.current(false)
      confirmResolver.current = null
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && confirmResolver.current) {
      handleCancel()
    }
    setOpen(nextOpen)
  }

  return (
    <AlertaDialogo
      open={open}
      onOpenChange={handleOpenChange}
      type={payload.type}
      title={payload.title}
      message={payload.message}
      confirmText={payload.confirmText}
      cancelText={payload.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )
}

