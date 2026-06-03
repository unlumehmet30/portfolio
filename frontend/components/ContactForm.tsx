"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/api";
import { type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/ui-copy";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const copy = getUiCopy(locale).contactForm;
  const [form, setForm] = useState(initialState);
  const [formStartedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setStatus("error");
      setFeedback(copy.nameRequired);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus("error");
      setFeedback(copy.invalidEmail);
      return;
    }

    if (form.message.trim().length < 10) {
      setStatus("error");
      setFeedback(copy.minMessage);
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await submitContact({
        ...form,
        companyWebsite: "",
        formStartedAt
      });
      setStatus("success");
      setFeedback(response.message);
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : copy.sendError);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-5 shadow-soft-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">{copy.name}</span>
          <Input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            autoComplete="name"
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">{copy.email}</span>
          <Input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            type="text"
            inputMode="email"
            autoComplete="email"
            required
          />
        </label>
      </div>
      <input
        type="text"
        name="companyWebsite"
        defaultValue=""
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="mt-4 block space-y-2 text-sm">
        <span className="text-muted-foreground">{copy.subject}</span>
        <Input
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          required
        />
      </label>
      <label className="mt-4 block space-y-2 text-sm">
        <span className="text-muted-foreground">{copy.message}</span>
        <Textarea
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          required
        />
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={
            status === "success"
              ? "text-sm text-emerald-500"
              : status === "error"
                ? "text-sm text-rose-500"
                : "text-sm text-muted-foreground"
          }
          role="status"
        >
          {feedback || copy.idleText}
        </p>
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
          {copy.send}
        </Button>
      </div>
    </form>
  );
}
