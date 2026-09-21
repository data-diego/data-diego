"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Panel } from "@/components/panel";
import { BlurFade } from "@/components/blur-fade";
import { StatefulButton } from "@/components/ui/stateful-button";

export function Contact({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const sendContact = useAction(api.contact.send);

  const handleSend = async () => {
    await sendContact({ name, email, message });
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Panel
      id="contact"
      href="/contact"
      label="Write to datadiego"
      className={className}
    >
      <BlurFade delay={0.1}>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          I&apos;m always open to new opportunities and conversations. Feel free
          to reach out.
        </p>

        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <StatefulButton
            onClick={handleSend}
            disabled={!name || !email || !message}
          >
            Send Message
          </StatefulButton>
          {sent && (
            <span className="text-xs text-muted-foreground">Message sent!</span>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <a
            href="mailto:info@datadiego.com"
            className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors group"
          >
            info@datadiego.com
            <svg
              className="h-3 w-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </BlurFade>
    </Panel>
  );
}
