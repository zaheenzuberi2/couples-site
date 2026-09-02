"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deletePhoto, setHeroPhoto } from "@/app/dashboard/actions";
import { photoUrlClient } from "@/lib/photo-url";
import { createClient } from "@/lib/supabase/client";
import type { SitePhoto } from "@/lib/types";
import { Section, ghostButtonClass } from "./ui";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Uploads go straight from the browser to Supabase Storage, so a large photo
 * never has to travel through a serverless function (and hit its body limit).
 * The storage RLS policy keys off the <site_id>/ prefix, which is why the
 * path is built here rather than accepted from anywhere else.
 */
export default function PhotoManager({
  siteId,
  photos,
  heroPhoto,
  maxPhotos = Infinity,
}: {
  siteId: string;
  photos: SitePhoto[];
  heroPhoto: string | null;
  maxPhotos?: number;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remaining = Math.max(0, maxPhotos - photos.length);
  const atLimit = Number.isFinite(maxPhotos) && remaining === 0;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setError(null);

    const supabase = createClient();
    const chosen = Array.from(files);
    let uploaded = 0;
    const failures: string[] = [];

    for (const [index, file] of chosen.entries()) {
      setProgress(`Uploading ${index + 1} of ${chosen.length}…`);

      if (photos.length + uploaded >= maxPhotos) {
        failures.push(
          `${file.name} skipped, you're at your plan's photo limit`
        );
        continue;
      }
      if (!ACCEPTED.includes(file.type)) {
        failures.push(`${file.name} isn't a JPG, PNG or WebP`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        failures.push(`${file.name} is over 10 MB`);
        continue;
      }

      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${siteId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("couple-photos")
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        failures.push(`${file.name} didn't upload`);
        continue;
      }

      const { error: rowError } = await supabase.from("site_photos").insert({
        site_id: siteId,
        image_path: path,
        sort_order: photos.length + uploaded,
      });

      if (rowError) {
        // Don't leave a file nobody can reach. A plan-limit rejection from
        // the database trigger lands here too, since count can drift if two
        // uploads race - that failure message is what shows below.
        await supabase.storage.from("couple-photos").remove([path]);
        failures.push(
          rowError.message.toLowerCase().includes("plan")
            ? `${file.name} skipped, you're at your plan's photo limit`
            : `${file.name} didn't save`
        );
        continue;
      }

      uploaded += 1;
    }

    setBusy(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (failures.length > 0) setError(failures.join(" · "));
    if (uploaded > 0) router.refresh();
  }

  return (
    <Section
      title="Photographs"
      hint={
        Number.isFinite(maxPhotos)
          ? `JPG, PNG or WebP, up to 10 MB each. ${photos.length} of ${maxPhotos} used on your plan.`
          : "JPG, PNG or WebP, up to 10 MB each. The one you star becomes your cover."
      }
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!atLimit) handleFiles(e.dataTransfer.files);
        }}
        className="border border-dashed border-line px-6 py-10 text-center"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          disabled={busy || atLimit}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
          id="photo-input"
        />
        {atLimit ? (
          <p className="text-sm text-muted">
            You&apos;ve used all {maxPhotos} photos on your plan. Message us to
            upgrade for unlimited photos.
          </p>
        ) : (
          <>
            <label
              htmlFor="photo-input"
              className={`${ghostButtonClass} inline-block cursor-pointer`}
            >
              {busy ? "Uploading…" : "Choose photos"}
            </label>
            <p className="mt-3 text-xs text-muted">or drag them here</p>
          </>
        )}
        {progress && <p className="mt-2 text-xs text-muted">{progress}</p>}
        {error && (
          <p role="alert" className="mt-3 text-xs text-accent">
            {error}
          </p>
        )}
      </div>

      {photos.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo) => {
            const src = photoUrlClient(photo.image_path);
            const isHero = heroPhoto === photo.image_path;
            return (
              <li key={photo.id} className="border border-line bg-card">
                <div className="relative aspect-4/3 bg-black/5">
                  {src && (
                    <Image
                      src={src}
                      alt={photo.caption || ""}
                      fill
                      sizes="(max-width: 640px) 50vw, 240px"
                      className="object-cover"
                    />
                  )}
                  {isHero && (
                    <span className="absolute top-2 left-2 bg-accent px-2 py-0.5 text-[0.6rem] tracking-[0.16em] text-white uppercase">
                      Cover
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                  <form action={setHeroPhoto}>
                    <input type="hidden" name="site_id" value={siteId} />
                    <input
                      type="hidden"
                      name="image_path"
                      value={isHero ? "" : photo.image_path}
                    />
                    <button
                      type="submit"
                      className="text-[0.65rem] tracking-[0.14em] text-muted uppercase hover:text-accent"
                    >
                      {isHero ? "Unset cover" : "Make cover"}
                    </button>
                  </form>

                  <form action={deletePhoto}>
                    <input type="hidden" name="site_id" value={siteId} />
                    <input type="hidden" name="photo_id" value={photo.id} />
                    <input
                      type="hidden"
                      name="image_path"
                      value={photo.image_path}
                    />
                    <button
                      type="submit"
                      className="text-[0.65rem] tracking-[0.14em] text-muted uppercase hover:text-accent"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
