import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { setContactHandled, setPaid } from "./actions";
import DeleteSiteButton from "@/components/admin/delete-site-button";
import { formatDate, formatDateTime } from "@/lib/format";
import { isAdminEmail, isSupabaseConfigured, siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Site } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type ContactRequest = {
  id: string;
  name: string;
  phone: string;
  message: string;
  page: string;
  handled: boolean;
  created_at: string;
};

export default async function AdminPage() {
  if (!isSupabaseConfigured) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");
  // 404 rather than 403: no reason to confirm this route exists.
  if (!isAdminEmail(user.email)) notFound();

  const db = createAdminClient();
  const { data } = await db
    .from("sites")
    .select("*")
    .order("created_at", { ascending: false });

  const sites = (data ?? []) as Site[];
  const paidCount = sites.filter((s) => s.is_paid).length;
  const publishedCount = sites.filter((s) => s.is_paid && s.is_published).length;

  const { data: contactData } = await db
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const contacts = (contactData ?? []) as ContactRequest[];
  const openContacts = contacts.filter((c) => !c.handled).length;

  // Sign-ups come from auth, not a table this client can select from with
  // a plain query - the admin API is the only way to count them. Capped at
  // 1000, which is far past anything this product has seen so far.
  const { data: usersData } = await db.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  const signupCount = usersData?.users.length ?? 0;

  const { count: playRoomCount } = await db
    .from("play_rooms")
    .select("id", { count: "exact", head: true });

  // Payment screenshots live in a private bucket - a signed URL is the only
  // way to view one, and it's generated fresh on every load of this page.
  const proofUrls = new Map<string, string>();
  await Promise.all(
    sites
      .filter((s) => s.payment_screenshot)
      .map(async (s) => {
        const { data: signed } = await db.storage
          .from("payment-proofs")
          .createSignedUrl(s.payment_screenshot as string, 60 * 60);
        if (signed) proofUrls.set(s.id, signed.signedUrl);
      })
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl">Admin</h1>
      <p className="mt-2 text-sm text-muted">A running count of everything happening on the product.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Sign-ups"
          value={signupCount}
          note="Total accounts, ever"
        />
        <StatCard
          label="Websites"
          value={sites.length}
          note={`${paidCount} paid · ${publishedCount} live`}
        />
        <StatCard
          label="Free tools used"
          value={playRoomCount ?? 0}
          note="Bucket lists & quizzes started"
        />
        <StatCard
          label="Callbacks waiting"
          value={openContacts}
          note={`${contacts.length} total left in help chat`}
          highlight={openContacts > 0}
        />
      </div>

      {sites.length === 0 ? (
        <p className="mt-12 border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
          No one has made a website yet.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-3xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <Th>Couple</Th>
                <Th>Address</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Payment proof</Th>
                <Th>Links</Th>
                <Th> </Th>
                <Th> </Th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className="border-b border-line align-middle">
                  <Td>
                    {site.partner_one} &amp; {site.partner_two}
                  </Td>
                  <Td>
                    <code className="text-xs">/{site.slug}</code>
                  </Td>
                  <Td className="text-muted">
                    {formatDate(site.event_date) || "No date"}
                  </Td>
                  <Td>
                    {site.is_paid ? (
                      site.is_published ? (
                        <span className="text-green-700">Live</span>
                      ) : (
                        <span className="text-amber-600">Paid, unpublished</span>
                      )
                    ) : (
                      <span className="text-muted">Unpaid</span>
                    )}
                  </Td>
                  <Td>
                    {proofUrls.has(site.id) ? (
                      <>
                        <a
                          href={proofUrls.get(site.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline underline-offset-4"
                        >
                          view screenshot
                        </a>
                        <span className="mt-0.5 block text-xs text-muted">
                          {formatDate(site.payment_submitted_at)}
                          {site.payment_note && ` · ${site.payment_note}`}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">Nothing yet</span>
                    )}
                  </Td>
                  <Td>
                    <a
                      href={`${siteUrl()}/preview/${site.preview_token}`}
                      className="text-accent underline underline-offset-4"
                    >
                      preview
                    </a>
                    {site.is_paid && site.is_published && (
                      <>
                        {" · "}
                        <a
                          href={`/${site.slug}`}
                          className="text-accent underline underline-offset-4"
                        >
                          live
                        </a>
                      </>
                    )}
                  </Td>
                  <Td>
                    <form action={setPaid}>
                      <input type="hidden" name="site_id" value={site.id} />
                      <input
                        type="hidden"
                        name="paid"
                        value={site.is_paid ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="border border-line px-3 py-1.5 text-xs tracking-[0.14em] uppercase hover:border-accent hover:text-accent"
                      >
                        {site.is_paid ? "Mark unpaid" : "Mark paid"}
                      </button>
                    </form>
                  </Td>
                  <Td>
                    <DeleteSiteButton
                      siteId={site.id}
                      coupleName={`${site.partner_one} & ${site.partner_two}`}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-16 font-display text-2xl">Callback requests</h2>
      <p className="mt-1 text-sm text-muted">
        Left in the help chat. Newest first.
      </p>

      {contacts.length === 0 ? (
        <p className="mt-6 border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
          No one has asked for a callback yet.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-3xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <Th>When</Th>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>About</Th>
                <Th>From</Th>
                <Th>Status</Th>
                <Th> </Th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b border-line align-middle ${c.handled ? "text-muted" : ""}`}
                >
                  <Td className="whitespace-nowrap text-muted">
                    {formatDateTime(c.created_at)}
                  </Td>
                  <Td>{c.name || "No name"}</Td>
                  <Td>
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, "")}`}
                      className="text-accent underline underline-offset-4"
                    >
                      {c.phone}
                    </a>
                  </Td>
                  <Td className="max-w-xs">{c.message || "No note"}</Td>
                  <Td className="text-muted">
                    <code className="text-xs">{c.page || "?"}</code>
                  </Td>
                  <Td>
                    {c.handled ? (
                      <span className="text-muted">Done</span>
                    ) : (
                      <span className="text-amber-600">Waiting</span>
                    )}
                  </Td>
                  <Td>
                    <form action={setContactHandled}>
                      <input type="hidden" name="id" value={c.id} />
                      <input
                        type="hidden"
                        name="handled"
                        value={c.handled ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="border border-line px-3 py-1.5 text-xs tracking-[0.14em] uppercase hover:border-accent hover:text-accent"
                      >
                        {c.handled ? "Reopen" : "Mark done"}
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  note,
  highlight = false,
}: {
  label: string;
  value: number;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border px-5 py-4 ${highlight ? "border-accent bg-accent-soft" : "border-line bg-card"}`}
    >
      <p className="text-xs tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="mt-1.5 font-display text-4xl">{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2.5 text-xs font-normal tracking-[0.14em] text-muted uppercase">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-3 ${className}`}>{children}</td>;
}
