"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  revealDelayMs?: number;
  charset?: string;
  flipDelayMs?: number;
  encryptedClassName?: string;
  revealedClassName?: string;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [revealCount, setRevealCount] = useState<number>(0);
  const [scrambleChars, setScrambleChars] = useState<string[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const scrambleRef = useRef<string[]>([]);

  // Mount guard — render plain text on server, scramble on client
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Initialize scramble
        const initial = text.split("").map((ch) =>
          ch === " " ? " " : generateRandomCharacter(charset)
        );
        scrambleRef.current = initial;
        setScrambleChars(initial);
        startTimeRef.current = performance.now();
        lastFlipTimeRef.current = startTimeRef.current;
        setRevealCount(0);

        const update = (now: number) => {
          const elapsedMs = now - startTimeRef.current;
          const totalLength = text.length;
          const currentRevealCount = Math.min(
            totalLength,
            Math.floor(elapsedMs / Math.max(1, revealDelayMs))
          );

          setRevealCount(currentRevealCount);

          if (currentRevealCount >= totalLength) return;

          const timeSinceLastFlip = now - lastFlipTimeRef.current;
          if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
            for (let i = 0; i < totalLength; i++) {
              if (i >= currentRevealCount && text[i] !== " ") {
                scrambleRef.current[i] = generateRandomCharacter(charset);
              }
            }
            setScrambleChars([...scrambleRef.current]);
            lastFlipTimeRef.current = now;
          }

          animationFrameRef.current = requestAnimationFrame(update);
        };

        animationFrameRef.current = requestAnimationFrame(update);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted, text, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;

  // Server + pre-mount: render plain text to avoid hydration mismatch
  if (!mounted) {
    return (
      <span ref={ref} className={cn(className)} aria-label={text} role="text">
        {text}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn(className)} aria-label={text} role="text">
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;
        const displayChar = isRevealed
          ? char
          : char === " "
            ? " "
            : (scrambleChars[index] ?? char);

        return (
          <span
            key={index}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        );
      })}
    </span>
  );
};
