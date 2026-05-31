"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/api";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [formStartedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setStatus("error");
      setFeedback("Name is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    if (form.message.trim().length < 10) {
      setStatus("error");
      setFeedback("Message must be at least 10 characters.");
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
      setFeedback(error instanceof Error ? error.message : "Could not send your message.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-5 shadow-soft-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Name</span>
          <Input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            autoComplete="name"
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Email</span>
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
        <span className="text-muted-foreground">Subject</span>
        <Input
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          required
        />
      </label>
      <label className="mt-4 block space-y-2 text-sm">
        <span className="text-muted-foreground">Message</span>
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
          {feedback || "I usually reply from email after seeing the message here."}
        </p>
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
          Send message
        </Button>
      </div>
    </form>
  );
}
