import Image from "next/image";
import { photoUrl } from "@/lib/data";
import {
  daysUntil,
  formatDate,
  formatDateTime,
  formatMonthYear,
} from "@/lib/format";
import { allowedTheme, tierConfig } from "@/lib/tiers";
import type { SiteBundle } from "@/lib/types";
import Hero from "@/components/hero";
import RsvpForm from "@/components/rsvp-form";
import QuizWidget from "@/components/quiz-widget";

/**
 * The couple's page. One component renders both modes:
 *   wedding  - invitation, event schedule, RSVP
 *   keepsake - love story, no guest management
 *
 * Every section is skipped when its content is empty, so a half-finished
 * page still looks deliberate rather than broken.
 *
 * Tier limits are re-checked here, not just trusted from the stored flags -
 * if a site is ever downgraded after the fact, the public page should never
 * show a feature the current plan doesn't include.
 */
export default function CouplePage({ bundle }: { bundle: SiteBundle }) {
  const { site, events, photos, timeline, bucketList, quizQuestions } = bundle;
  const isWedding = site.mode === "wedding";
  const config = tierConfig(site.tier);
  const theme = allowedTheme(site.tier, site.theme);

  const heroSrc = photoUrl(site.hero_photo) ?? photoUrl(photos[0]?.image_path);
  const galleryPhotos = (site.hero_photo ? photos : photos.slice(1)).slice(
    0,
    config.maxPhotos
  ); // first photo was promoted to the hero

  const countdown = isWedding ? daysUntil(site.event_date) : null;
  const showEvents = isWedding && config.events && events.length > 0;
  const showRsvp = isWedding && config.rsvp && site.rsvp_enabled;

  return (
    <div data-theme={theme} className="min-h-screen">
      <Hero
        site={site}
        heroSrc={heroSrc}
        countdown={countdown}
        showRsvp={showRsvp}
      />

      {site.story.trim() && <Story site={site} isWedding={isWedding} />}

      {timeline.length > 0 && <Timeline entries={timeline} />}

      {bucketList.length > 0 && <BucketList items={bucketList} />}

      {showEvents && <Events events={events} venueNote={site.venue_note} />}

      {galleryPhotos.length > 0 && <Gallery photos={galleryPhotos} />}

      {quizQuestions.length > 0 && (
        <QuizWidget siteId={site.id} questions={quizQuestions} />
      )}

      {showRsvp && (
        <section
          id="rsvp"
          className="px-6 py-24 sm:py-32"
          style={{ background: "var(--paper-alt)" }}
        >
          <div className="mx-auto max-w-xl">
            <SectionHeading
              eyebrow="Will you join us"
              title="RSVP"
              subtitle={
                site.rsvp_deadline
                  ? `Kindly reply by ${formatDate(site.rsvp_deadline)}`
                  : undefined
              }
            />
            <RsvpForm siteId={site.id} />
          </div>
        </section>
      )}

      <Footer site={site} />
    </div>
  );
}

/* --------------------------------------------------------------- story */

function Story({
  site,
  isWedding,
}: {
  site: SiteBundle["site"];
  isWedding: boolean;
}) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading
          eyebrow={isWedding ? "Our story" : "A letter"}
          title={isWedding ? "How we got here" : "For you"}
        />
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

/* ---------------------------------------------------------- bucket list */

function BucketList({ items }: { items: SiteBundle["bucketList"] }) {
  const done = items.filter((i) => i.done).length;

  return (
    <section
      className="px-6 py-24 sm:py-32"
      style={{ background: "var(--paper-alt)" }}
    >
      <div className="mx-auto max-w-xl">
        <SectionHeading
          eyebrow="Still to come"
          title="Our bucket list"
          subtitle={`${done} of ${items.length} done`}
        />

        <ul className="mt-10 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 border px-4 py-3"
              style={{
                borderColor: "var(--rule)",
                background: "var(--paper)",
              }}
            >
              <span
                aria-hidden
                className="flex h-5 w-5 shrink-0 items-center justify-center border"
                style={
                  item.done
                    ? { borderColor: "var(--gilt)", background: "var(--gilt)" }
                    : { borderColor: "var(--rule)" }
                }
              >
                {item.done && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3 w-3"
                    style={{ color: "var(--paper)" }}
                  >
                    <path
                      d="M3 8.5 6.5 12 13 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className="text-sm"
                style={{
                  color: item.done ? "var(--whisper)" : "var(--ink)",
                  textDecoration: item.done ? "line-through" : undefined,
                }}
              >
                {item.item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- events */

function Events({
  events,
  venueNote,
}: {
  events: SiteBundle["events"];
  venueNote: string;
}) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Join us" title="The celebrations" centered />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex flex-col border p-8 text-center"
              style={{ borderColor: "var(--rule)" }}
            >
              <h3 className="display text-3xl">{event.title}</h3>

              {event.starts_at && (
                <p className="eyebrow mt-4">{formatDateTime(event.starts_at)}</p>
              )}

              <div className="rule-diamond my-6">
                <Diamond />
              </div>

              {event.venue && (
                <p className="font-medium">{event.venue}</p>
              )}
              {event.address && (
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: "var(--whisper)" }}
                >
                  {event.address}
                </p>
              )}
              {event.dress_code && (
                <p
                  className="mt-4 text-sm italic"
                  style={{ color: "var(--whisper)" }}
                >
                  {event.dress_code}
                </p>
              )}

              {event.map_url && (
                <a
                  href={event.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block self-center border-b pb-0.5 text-xs tracking-[0.18em] uppercase"
                  style={{ color: "var(--gilt)", borderColor: "var(--gilt)" }}
                >
                  View map
                </a>
              )}
            </article>
          ))}
        </div>

        {venueNote.trim() && (
          <p
            className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed"
            style={{ color: "var(--whisper)" }}
          >
            {venueNote}
          </p>
        )}
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

function Diamond() {
  return (
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 rotate-45"
      style={{ background: "var(--gilt)" }}
    />
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
