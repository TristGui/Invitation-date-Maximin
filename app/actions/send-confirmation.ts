"use server"

import { Resend } from "resend"

// Envoi limité à cette seule adresse pour le moment.
// Pour envoyer aux deux, remets : ["trg9638@gmail.com", "emiliee.lux@gmail.com"]
const RECIPIENTS = ["trg9638@gmail.com"]
const FROM = "Notre Date <onboarding@resend.dev>"

type SendResult = { ok: true } | { ok: false; error: string }

export async function sendConfirmation(
  activityLabel: string,
  dateISO: string,
): Promise<SendResult> {
  if (!activityLabel || !dateISO) {
    return { ok: false, error: "Activité ou date manquante." }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      error:
        "La clé RESEND_API_KEY n'est pas configurée. Ajoute-la dans les réglages du projet pour activer l'envoi des e-mails.",
    }
  }

  const prettyDate = new Date(`${dateISO}T00:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff5f6; border-radius: 16px; color: #4a2530;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">C'est officiel, on a un rendez-vous !</h1>
      <p style="margin: 0 0 24px; color: #8a5560;">Voici les détails de notre prochain moment ensemble.</p>
      <div style="background: white; border: 1px solid #f3d6db; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #b06a78;">Activité</p>
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600;">${activityLabel}</p>
        <p style="margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #b06a78;">Date</p>
        <p style="margin: 0; font-size: 18px; font-weight: 600; text-transform: capitalize;">${prettyDate}</p>
      </div>
      <p style="margin: 0; color: #8a5560;">Hâte d'y être. À très vite.</p>
    </div>
  `

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENTS,
      subject: `Rendez-vous confirmé : ${activityLabel}`,
      html,
    })

    if (error) {
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur lors de l'envoi des e-mails.",
    }
  }
}
