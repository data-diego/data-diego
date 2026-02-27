"use client";

import { useRef, useCallback, useState } from "react";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt?: number;
  tags: string[];
  editHref?: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishedAt,
  tags,
}: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 16;
      const rotateY = (x - 0.5) * 16;
      setTransform(
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );
      setGlowPos({ x: x * 100, y: y * 100 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("");
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group"
      style={{
        transform: transform || undefined,
        transition: transform
          ? "transform 0.1s ease-out"
          : "transform 0.4s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
          {/* Background image */}
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          {/* Comet glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-base font-semibold text-white leading-tight mb-1.5 line-clamp-2">
              {title}
            </h3>

            <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-2">
              {excerpt}
            </p>

            {publishedAt && (
              <span className="text-[10px] text-white/40 tabular-nums">
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Border glow on hover */}
          <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />
        </div>
      </Link>
    </div>
  );
}
