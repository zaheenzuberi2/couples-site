import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { setPaid, setTier } from "./actions";
import { formatDate } from "@/lib/format";
import { isAdminEmail, isSupabaseConfigured, siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TIER_ORDER, TIERS } from "@/lib/tiers";
import type { Site } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
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

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl">Admin</h1>
      <p className="mt-2 text-sm text-muted">
        {sites.length} page{sites.length === 1 ? "" : "s"} · {paidCount} paid
      </p>

      {sites.length === 0 ? (
        <p className="mt-12 border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
          No one has made a page yet.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-3xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <Th>Couple</Th>
                <Th>Address</Th>
                <Th>Mode</Th>
                <Th>Package</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Links</Th>
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
                  <Td className="text-muted">{site.mode}</Td>
                  <Td>
                    <form action={setTier} className="flex items-center gap-1.5">
                      <input type="hidden" name="site_id" value={site.id} />
                      <select
                        name="tier"
                        defaultValue={site.tier}
                        className="border border-line bg-card px-1.5 py-1 text-xs"
                      >
                        {TIER_ORDER.map((t) => (
                          <option key={t} value={t}>
                            {TIERS[t].name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-[0.65rem] tracking-[0.1em] text-muted uppercase hover:text-accent"
                      >
                        Set
                      </button>
                    </form>
                  </Td>
                  <Td className="text-muted">
                    {formatDate(site.event_date) || "—"}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
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
