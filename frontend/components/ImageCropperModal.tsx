"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Crop, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AspectOption = {
  label: string;
  value: number;
};

const defaultAspectOptions: AspectOption[] = [
  { label: "16:9", value: 16 / 9 },
  { label: "2:1", value: 2 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 }
];

type CropBox = {
  height: number;
  width: number;
  x: number;
  y: number;
};

function fileBaseName(file: File) {
  return file.name.replace(/\.[^.]+$/, "") || "image";
}

function calculateCrop(image: HTMLImageElement, aspectRatio: number, zoom: number, xPercent: number, yPercent: number): CropBox {
  const imageAspect = image.naturalWidth / image.naturalHeight;
  let baseWidth = image.naturalWidth;
  let baseHeight = image.naturalHeight;

  if (imageAspect > aspectRatio) {
    baseWidth = image.naturalHeight * aspectRatio;
  } else {
    baseHeight = image.naturalWidth / aspectRatio;
  }

  const width = Math.max(1, baseWidth / zoom);
  const height = Math.max(1, baseHeight / zoom);
  const maxX = Math.max(0, image.naturalWidth - width);
  const maxY = Math.max(0, image.naturalHeight - height);

  return {
    x: maxX * (xPercent / 100),
    y: maxY * (yPercent / 100),
    width,
    height
  };
}

function drawCrop(canvas: HTMLCanvasElement, image: HTMLImageElement, crop: CropBox, aspectRatio: number) {
  const maxWidth = 1600;
  const width = Math.min(maxWidth, Math.max(480, Math.round(crop.width)));
  const height = Math.round(width / aspectRatio);
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
}

async function canvasToFile(canvas: HTMLCanvasElement, originalFile: File) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error("Could not create cropped image."));
        return;
      }

      resolve(result);
    }, "image/jpeg", 0.92);
  });

  return new File([blob], `${fileBaseName(originalFile)}-cropped.jpg`, {
    type: "image/jpeg"
  });
}

export function ImageCropperModal({
  allowOriginalUpload = true,
  aspectOptions = defaultAspectOptions,
  file,
  initialAspectRatio,
  initialZoom = 1.15,
  isUploading,
  onCancel,
  onCropped,
  onOriginal,
  title
}: {
  allowOriginalUpload?: boolean;
  aspectOptions?: AspectOption[];
  file: File;
  initialAspectRatio: number;
  initialZoom?: number;
  isUploading: boolean;
  onCancel: () => void;
  onCropped: (file: File) => Promise<void>;
  onOriginal: (file: File) => Promise<void>;
  title: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [xPercent, setXPercent] = useState(50);
  const [yPercent, setYPercent] = useState(50);
  const [zoom, setZoom] = useState(initialZoom);
  const [error, setError] = useState("");

  const selectedAspectLabel = useMemo(
    () => aspectOptions.find((option) => option.value === aspectRatio)?.label ?? "Custom",
    [aspectOptions, aspectRatio]
  );

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    const nextImage = new window.Image();

    setError("");
    setImage(null);
    setZoom(initialZoom);
    setXPercent(50);
    setYPercent(50);
    setAspectRatio(initialAspectRatio);

    nextImage.onload = () => {
      setImage(nextImage);
    };
    nextImage.onerror = () => {
      setError("This image could not be loaded for cropping.");
    };
    nextImage.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file, initialAspectRatio, initialZoom]);

  useEffect(() => {
    if (!image || !canvasRef.current) {
      return;
    }

    drawCrop(canvasRef.current, image, calculateCrop(image, aspectRatio, zoom, xPercent, yPercent), aspectRatio);
  }, [aspectRatio, image, xPercent, yPercent, zoom]);

  async function cropAndUpload() {
    if (!image || !canvasRef.current) {
      setError("Image is not ready yet.");
      return;
    }

    drawCrop(canvasRef.current, image, calculateCrop(image, aspectRatio, zoom, xPercent, yPercent), aspectRatio);
    await onCropped(await canvasToFile(canvasRef.current, file));
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/80 px-4 py-6 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-lg border border-border bg-card shadow-soft-card">
        <div className="flex items-start justify-between gap-4 border-b border-border p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Crop image</p>
            <h2 className="mt-1 text-xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{file.name}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onCancel} title="Close crop editor">
            <X size={17} />
          </Button>
        </div>

        <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-md border border-border bg-muted p-3">
            <canvas
              ref={canvasRef}
              className="block w-full rounded-md bg-white"
              style={{ aspectRatio }}
              aria-label="Cropped image preview"
            />
            {error ? <p className="mt-3 text-sm text-rose-500">{error}</p> : null}
            {!image && !error ? <p className="mt-3 text-sm text-muted-foreground">Preparing preview...</p> : null}
          </div>

          <div className="grid content-start gap-4">
            <label className="block space-y-2 text-sm">
              <span className="text-muted-foreground">Aspect ratio</span>
              <select
                value={aspectRatio}
                onChange={(event) => setAspectRatio(Number(event.target.value))}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {aspectOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>Crop amount</span>
                <span>{zoom.toFixed(2)}x</span>
              </span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-accent"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-muted-foreground">Horizontal position</span>
              <input
                type="range"
                min="0"
                max="100"
                value={xPercent}
                onChange={(event) => setXPercent(Number(event.target.value))}
                className="w-full accent-accent"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-muted-foreground">Vertical position</span>
              <input
                type="range"
                min="0"
                max="100"
                value={yPercent}
                onChange={(event) => setYPercent(Number(event.target.value))}
                className="w-full accent-accent"
              />
            </label>

            {file.type === "image/gif" ? (
              <p className="rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground">
                Cropping a GIF saves a still JPEG frame.
              </p>
            ) : null}

            <div className="grid gap-2 pt-2">
              <Button type="button" onClick={() => void cropAndUpload()} disabled={!image || isUploading}>
                <Crop size={17} />
                {isUploading ? "Uploading..." : `Crop ${selectedAspectLabel} and upload`}
              </Button>
              {allowOriginalUpload ? (
                <Button type="button" variant="outline" onClick={() => void onOriginal(file)} disabled={isUploading}>
                  <Upload size={17} />
                  Upload original
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isUploading}>
                Skip this image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
