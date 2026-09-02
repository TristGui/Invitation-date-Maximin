"use server"

import { Resend } from "resend"

const RECIPIENTS = ["challax78@gmail.com"]
const FROM = "Notre Date <onboarding@resend.dev>"
type SendResult = { ok: true } | { ok: false; error: string }

export async function sendConfirmation(
  userName: string,
  activityLabel: string,
  dateISO: string,
  time: string,
): Promise<SendResult> {
  if (!userName || !activityLabel || !dateISO || !time) {
    return { ok: false, error: "Informations manquantes (nom, activité, date ou heure)." }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      error: "La clé RESEND_API_KEY n'est pas configurée dans les variables d'environnement.",
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
      <p style="margin: 0 0 24px; color: #8a5560;">Voici les détails confirmés par <strong>${userName}</strong>.</p>
      <div style="background: white; border: 1px solid #f3d6db; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #b06a78;">Participant(e)</p>
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600;">${userName}</p>
        <p style="margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #b06a78;">Activité</p>
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600;">${activityLabel}</p>
        <p style="margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #b06a78;">Date & Heure</p>
        <p style="margin: 0; font-size: 18px; font-weight: 600; text-transform: capitalize;">${prettyDate} à ${time}</p>
      </div>
      <p style="margin: 0; color: #8a5560;">Hâte d'y être. À très vite.</p>
    </div>
  `

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENTS,
      subject: `Rendez-vous confirmé par ${userName} : ${activityLabel}`,
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