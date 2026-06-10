"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import type { ProjectImage } from "@/types/content";
import type { KeyboardEvent, PointerEvent } from "react";

type ProjectGalleryProps = {
  title: string;
  projectTitle: string;
  images: ProjectImage[];
  locale?: Locale;
  className?: string;
};

function shouldSkipOptimization(src: string) {
  return src.startsWith("/api/uploads/") || src.startsWith("http");
}

function isTextInputTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function ProjectGallery({ title, projectTitle, images, locale = "en", className }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const pointerOffsetX = useRef(0);
  const labels =
    locale === "tr"
      ? {
          previous: "Önceki görsel",
          next: "Sonraki görsel",
          show: "Görseli göster"
        }
      : {
          previous: "Previous image",
          next: "Next image",
          show: "Show image"
        };

  const imageCount = images.length;
  const canNavigate = imageCount > 1;

  const goTo = useCallback((index: number) => {
    if (!imageCount) return;
    setActiveIndex((index + imageCount) % imageCount);
  }, [imageCount]);

  const goPrevious = useCallback(() => {
    if (!imageCount) return;
    setActiveIndex((index) => (index - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const goNext = useCallback(() => {
    if (!imageCount) return;
    setActiveIndex((index) => (index + 1) % imageCount);
  }, [imageCount]);

  useEffect(() => {
    if (!canNavigate) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (isTextInputTarget(event.target)) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canNavigate, goNext, goPrevious]);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!canNavigate) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      goPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      goNext();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!canNavigate) return;
    pointerStartX.current = event.clientX;
    pointerOffsetX.current = 0;
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;
    const nextOffset = event.clientX - pointerStartX.current;
    pointerOffsetX.current = nextOffset;
    setDragOffset(nextOffset);
  }

  function handlePointerEnd() {
    if (pointerStartX.current === null) return;

    if (pointerOffsetX.current > 48) {
      goPrevious();
    } else if (pointerOffsetX.current < -48) {
      goNext();
    }

    pointerStartX.current = null;
    pointerOffsetX.current = 0;
    setDragOffset(0);
  }

  if (!images.length) return null;

  return (
    <section
      className={cn(
        "mt-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        className
      )}
      aria-label={title}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h2>
        {canNavigate ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              title={labels.previous}
              aria-label={labels.previous}
              onClick={goPrevious}
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              title={labels.next}
              aria-label={labels.next}
              onClick={goNext}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className="relative overflow-hidden border border-border bg-muted touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div
          className={cn(
            "flex transition-transform duration-300 ease-out",
            pointerStartX.current !== null && "transition-none"
          )}
          style={{
            transform: `translateX(calc(${-activeIndex * 100}% + ${dragOffset}px))`
          }}
        >
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="relative aspect-video w-full shrink-0">
              <Image
                src={image.url}
                alt={image.alt || `${projectTitle} screenshot ${index + 1}`}
                fill
                sizes="(min-width: 1200px) 1200px, 100vw"
                unoptimized={shouldSkipOptimization(image.url)}
                className="object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {canNavigate ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <button
                key={`${image.url}-dot-${index}`}
                type="button"
                className={cn(
                  "h-2.5 w-2.5 rounded-full border border-border transition",
                  index === activeIndex ? "bg-accent" : "bg-transparent hover:bg-muted-foreground/30"
                )}
                aria-label={`${labels.show} ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {activeIndex + 1}/{imageCount}
          </p>
        </div>
      ) : null}
    </section>
  );
}
