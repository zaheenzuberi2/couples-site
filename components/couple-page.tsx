import Image from "next/image";
import { photoUrl } from "@/lib/data";
import { formatDate, formatMonthYear } from "@/lib/format";
import type { SiteBundle } from "@/lib/types";
import Hero from "@/components/hero";

/**
 * The couple's page: a keepsake love-story page. Every section is skipped
 * when its content is empty, so a half-finished page still looks
 * deliberate rather than broken.
 */
export default function CouplePage({ bundle }: { bundle: SiteBundle }) {
  const { site, photos, timeline } = bundle;

  const heroSrc = photoUrl(site.hero_photo) ?? photoUrl(photos[0]?.image_path);
  const galleryPhotos = site.hero_photo ? photos : photos.slice(1); // first photo was promoted to the hero

  return (
    <div data-theme={site.theme} className="min-h-screen">
      <Hero site={site} heroSrc={heroSrc} />

      {site.story.trim() && <Story site={site} />}

      {timeline.length > 0 && <Timeline entries={timeline} />}

      {galleryPhotos.length > 0 && <Gallery photos={galleryPhotos} />}

      <Footer site={site} />
    </div>
  );
}

/* --------------------------------------------------------------- story */

function Story({ site }: { site: SiteBundle["site"] }) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading eyebrow="A letter" title="For you" />
        <div className="mt-10 space-y-6 text-left">
          {site.story
            .split(/\n+/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p
                key={i}
                className="text-[1.05rem] leading-[1.85]"
                style={{ color: "var(--ink)" }}
              >
                {para}
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ timeline */

function Timeline({ entries }: { entries: SiteBundle["timeline"] }) {
  return (
    <section
      className="px-6 py-24 sm:py-32"
      style={{ background: "var(--paper-alt)" }}
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="Moments" title="How it happened" centered />

        <ol className="mt-14 space-y-12">
          {entries.map((entry, i) => (
            <li key={entry.id} className="relative pl-8 sm:pl-12">
              <span
                aria-hidden
                className="absolute top-2 left-0 h-2 w-2 rotate-45"
                style={{ background: "var(--gilt)" }}
              />
              {/* Connector runs into the next entry, so the last one omits it. */}
              {i < entries.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-6 bottom-[-3rem] left-[3.5px] w-px"
                  style={{ background: "var(--rule)" }}
                />
              )}
              {entry.happened_on && (
                <p className="eyebrow">{formatMonthYear(entry.happened_on)}</p>
              )}
              <h3 className="display mt-2 text-2xl">{entry.title}</h3>
              {entry.body.trim() && (
                <p
                  className="mt-3 leading-relaxed"
                  style={{ color: "var(--whisper)" }}
                >
                  {entry.body}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- gallery */

function Gallery({ photos }: { photos: SiteBundle["photos"] }) {
  return (
    <section
      className="px-6 py-24 sm:py-32"
      style={{ background: "var(--paper-alt)" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Together" title="Photographs" centered />

        {/* CSS columns give a masonry feel without a layout library. */}
        <div className="mt-14 columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
          {photos.map((photo) => {
            const src = photoUrl(photo.image_path);
            if (!src) return null;
            return (
              <figure key={photo.id} className="break-inside-avoid">
                <Image
                  src={src}
                  alt={photo.caption || ""}
                  width={800}
                  height={1000}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                  className="h-auto w-full object-cover"
                />
                {photo.caption.trim() && (
                  <figcaption
                    className="mt-2 text-center text-xs tracking-wide"
                    style={{ color: "var(--whisper)" }}
                  >
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- shared */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-3 text-4xl sm:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-sm" style={{ color: "var(--whisper)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Footer({ site }: { site: SiteBundle["site"] }) {
  const names = [site.partner_one, site.partner_two].filter(Boolean).join(" & ");
  return (
    <footer
      className="border-t px-6 py-14 text-center"
      style={{ borderColor: "var(--rule)" }}
    >
      <p className="display text-2xl">{names}</p>
      {site.event_date && (
        <p className="eyebrow mt-3">{formatDate(site.event_date)}</p>
      )}
    </footer>
  );
}
