"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BlurFade } from "@/components/blur-fade";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { DitherShader } from "@/components/ui/dither-shader";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { useOutsideClick } from "@/hooks/use-outside-click";

export function Hero() {
  const [contactOpen, setContactOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setContactOpen(false);
    }
    if (contactOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactOpen]);

  useOutsideClick(modalRef, () => setContactOpen(false));

  return (
    <section className="relative -mt-14 pt-14 py-16 sm:py-20 overflow-hidden">
      {/* Dotted glow — hero only, fades out at the bottom */}
      <DottedGlowBackground
        className="pointer-events-none [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
        opacity={0.4}
        gap={18}
        radius={1}
        color="rgba(0,0,0,0.4)"
        darkColor="rgba(255,255,255,0.4)"
        glowColor="rgba(120, 100, 255, 0.7)"
        darkGlowColor="rgba(160, 140, 255, 0.7)"
        speedMin={0.2}
        speedMax={0.9}
        speedScale={0.7}
      />

      <div className="relative max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-8">
          {/* Text content */}
          <div className="flex-1 space-y-4 sm:text-left  sm:items-start flex flex-col">
            <BlurFade>
              <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                <EncryptedText
                  text="Inventor · Indie Hacker · Santiago, Chile"
                  revealDelayMs={40}
                  flipDelayMs={30}
                  encryptedClassName="text-muted-foreground/50"
                />
              </p>
            </BlurFade>

            <BlurFade delay={0.1}>
              <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
                  <EncryptedText
                    text="Diego"
                    revealDelayMs={80}
                    flipDelayMs={40}
                    encryptedClassName="text-muted-foreground/40"
                  />
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2}>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                I translate ideas into real products people use every day,
                from code and electronics to design and user experience.
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="flex items-center justify-center sm:justfy-start gap-4 pt-2 text-sm">
                <Link
                  href="/blog"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  Blog
                </Link>
                <a
                  href="https://github.com/data-diego"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://x.com/datadiego_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  X
                </a>
                <button
                  onClick={() => setContactOpen(true)}
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  Contact
                </button>
              </div>
            </BlurFade>
          </div>

          {/* Dither shader portrait */}
          <BlurFade delay={0.15}>
            <div className="shrink-0 w-40 h-40 sm:w-48 sm:h-48">
              <DitherShader
                src="/profile.png"
                gridSize={3}
                ditherMode="bayer"
                colorMode="grayscale"
                contrast={1.2}
                brightness={0.05}
                darkInvert
                transparentBackground
                className="h-full w-full"
              />
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Contact modal */}
      {/* Contact modal overlay */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Contact modal card */}
      <AnimatePresence>
        {contactOpen && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-background rounded-full h-8 w-8 border border-border"
              onClick={() => { setContactOpen(false); setSent(false); }}
            >
              <svg
                className="h-4 w-4 text-foreground"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </motion.button>
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="glass-surface relative w-full max-w-[500px] h-fit max-h-[90%] flex flex-col bg-background border border-border rounded-2xl overflow-hidden shadow-xl"
            >
              <LiquidGlass
                radius={16}
                scale={56}
                depth={28}
                curvature={6}
                chroma={0.25}
                surfaceColor="oklch(0.22 0.025 270 / 0.26)"
              />
              <div className="relative z-10 p-6 overflow-y-auto">
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 size-12 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-bold shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">Get in touch</h3>
                    <p className="text-sm text-muted-foreground">Send me a message</p>
                  </div>
                </div>

                {sent ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center space-y-2"
                  >
                    <p className="text-sm font-semibold">Message sent!</p>
                    <p className="text-sm text-muted-foreground">I&apos;ll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSending(true);
                        const data = new FormData(e.currentTarget);
                        try {
                          const res = await fetch("/api/contact", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: data.get("name"),
                              email: data.get("email"),
                              message: data.get("message"),
                            }),
                          });
                          if (!res.ok) throw new Error();
                          setSent(true);
                        } catch {
                          alert("Failed to send. Please try again.");
                        } finally {
                          setSending(false);
                        }
                      }}
                      className="space-y-3"
                    >
                      <div className="space-y-1.5">
                        <label htmlFor="contact-name" className="text-xs font-medium text-muted-foreground">Name</label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground">Email</label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="contact-message" className="text-xs font-medium text-muted-foreground">Message</label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={4}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow resize-none"
                          placeholder="What's on your mind?"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sending}
                        className="glass-cta w-full rounded-lg bg-foreground text-background py-2 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                      >
                        {sending ? "Sending..." : "Send message"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
