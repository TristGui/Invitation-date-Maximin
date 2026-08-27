"use client"

import type React from "react"
import { useState, useMemo, useTransition } from "react"
import { Film, UtensilsCrossed, Trees, Heart, Check, EyeOff, Target, Landmark } from "lucide-react"
import { sendConfirmation } from "@/app/actions/send-confirmation"

type Activity = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

const ACTIVITIES: Activity[] = [
  {
    id: "Cinema",
    label: "Cinéma",
    description: "Un bon film, main dans la main",
    icon: <Film className="size-7" aria-hidden="true" />,
  },
  {
    id: "Pique-nique",
    label: "Pique-nique",
    description: "Une couverture, le soleil, nous deux",
    icon: <Trees className="size-7" aria-hidden="true" />,
  },
  {
    id: "Resto",
    label: "Restaurant",
    description: "Un dîner rien que pour toi",
    icon: <UtensilsCrossed className="size-7" aria-hidden="true" />,
  },
  {
    id: "Degustation",
    label: "Dégustation à l'aveugle",
    description: "Les yeux bandés : Coca ou Pepsi ?",
    icon: <EyeOff className="size-7" aria-hidden="true" />,
  },
  {
    id: "Bowling",
    label: "Bowling",
    description: "Un strike, un fou rire, un défi",
    icon: <Target className="size-7" aria-hidden="true" />,
  },
  {
    id: "Musee",
    label: "Musée",
    description: "Flâner devant les œuvres, à deux",
    icon: <Landmark className="size-7" aria-hidden="true" />,
  },
]

export function DateInvitation() {
  const [activity, setActivity] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const chosen = ACTIVITIES.find((a) => a.id === activity)

  const prettyDate = useMemo(() => {
    if (!date) return ""
    const d = new Date(date + "T00:00:00")
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }, [date])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activity || !date) return
    const label = ACTIVITIES.find((a) => a.id === activity)?.label ?? activity
    setEmailError("")
    setSubmitted(true)
    startTransition(async () => {
      const result = await sendConfirmation(label, date)
      if (!result.ok) {
        setEmailError(result.error)
      }
    })
  }

  if (submitted && chosen) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-8" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-balance text-foreground">C&apos;est un rendez-vous !</h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          On se retrouve pour un(e) <span className="font-medium text-primary">{chosen.label.toLowerCase()}</span>
        </p>
        <p className="mt-1 text-pretty leading-relaxed text-muted-foreground">
          le <span className="font-medium text-primary">{prettyDate}</span>.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">J&apos;ai déjà hâte d&apos;y être.</p>

        <div className="mt-6" aria-live="polite">
          {isPending ? (
            <p className="text-sm text-muted-foreground">Envoi des e-mails de confirmation…</p>
          ) : emailError ? (
            <p className="mx-auto max-w-sm rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-pretty text-destructive">
              L&apos;e-mail n&apos;a pas pu être envoyé : {emailError}
            </p>
          ) : (
            <p className="text-sm font-medium text-primary">
              Un e-mail de confirmation a été envoyé.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setEmailError("")
          }}
          className="mt-8 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Modifier mon choix
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-accent text-primary">
          <Heart className="size-7 fill-current" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-4xl font-semibold text-balance text-foreground sm:text-5xl">
          On se fait un date ?
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Choisis l&apos;activité et le jour qui te conviennent, je m&apos;occupe du reste.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10">
        <fieldset>
          <legend className="sr-only">Choisis une activité</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            {ACTIVITIES.map((a) => {
              const selected = activity === a.id
              return (
                <label
                  key={a.id}
                  className={`group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 bg-card p-6 text-center transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                    selected
                      ? "scale-[1.03] border-primary bg-accent shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="activite"
                    value={a.id}
                    checked={selected}
                    onChange={() => setActivity(a.id)}
                    className="sr-only"
                    required
                  />
                  <span
                    className={`flex size-12 items-center justify-center rounded-full transition-colors ${
                      selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                    }`}
                  >
                    {a.icon}
                  </span>
                  <span className="font-serif text-lg font-medium text-foreground">{a.label}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{a.description}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-8 flex flex-col items-center gap-2">
          <label htmlFor="date" className="text-sm font-medium text-foreground">
            Quel jour te dirait ?
          </label>
          <input
            type="date"
            id="date"
            name="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            disabled={!activity || !date}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Heart className="size-4 fill-current" aria-hidden="true" />
            C&apos;est validé !
          </button>
        </div>
      </form>
    </div>
  )
}
