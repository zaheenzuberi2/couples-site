import { formatDate } from "@/lib/format";
import type { Rsvp } from "@/lib/types";
import { Section } from "./ui";

export default function RsvpList({ rsvps }: { rsvps: Rsvp[] }) {
  const coming = rsvps.filter((r) => r.attending);
  const guestCount = coming.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <Section
      title="Replies"
      hint={
        rsvps.length === 0
          ? undefined
          : `${guestCount} coming · ${rsvps.length - coming.length} can't make it`
      }
    >
      {rsvps.length === 0 ? (
        <p className="border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          No replies yet. They&apos;ll appear here as guests respond.
        </p>
      ) : (
        <ul className="divide-y divide-line border border-line bg-card">
          {rsvps.map((rsvp) => (
            <li key={rsvp.id} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium">{rsvp.guest_name}</span>
                <span
                  className={`text-xs tracking-[0.14em] uppercase ${
                    rsvp.attending ? "text-green-700" : "text-muted"
                  }`}
                >
                  {rsvp.attending
                    ? rsvp.party_size > 1
                      ? `Coming · ${rsvp.party_size} people`
                      : "Coming"
                    : "Can't make it"}
                </span>
                <span className="ml-auto text-xs text-muted">
                  {formatDate(rsvp.created_at)}
                </span>
              </div>

              {rsvp.guest_email && (
                <p className="mt-1 text-xs text-muted">{rsvp.guest_email}</p>
              )}
              {rsvp.message && (
                <p className="mt-2 text-sm leading-relaxed">{rsvp.message}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
