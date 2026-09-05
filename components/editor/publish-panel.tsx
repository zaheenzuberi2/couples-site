import { setPublished } from "@/app/dashboard/actions";
import PaymentPanel from "@/components/editor/payment-panel";
import { PRICE_LABEL } from "@/lib/env";
import type { Site } from "@/lib/types";

/**
 * The paywall, stated plainly. Couples can build and share a private preview
 * for free; paying is what buys the public address.
 */
export default function PublishPanel({
  site,
  publicUrl,
  previewUrl,
  highlightUpgrade,
}: {
  site: Site;
  publicUrl: string;
  previewUrl: string;
  highlightUpgrade: boolean;
}) {
  const live = site.is_paid && site.is_published;

  return (
    <div
      className={`mt-8 border p-6 ${
        highlightUpgrade && !site.is_paid
          ? "border-accent bg-accent-soft"
          : "border-line bg-card"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          aria-hidden
          className={`h-2 w-2 rounded-full ${live ? "bg-green-600" : "bg-amber-500"}`}
        />
        <h2 className="font-display text-2xl">
          {live ? "Your website is live" : "Your website is private"}
        </h2>
      </div>

      <dl className="mt-5 space-y-4 text-sm">
        <div>
          <dt className="text-xs tracking-[0.16em] text-muted uppercase">
            Price
          </dt>
          <dd className="mt-1">{PRICE_LABEL}, once</dd>
        </div>

        <div>
          <dt className="text-xs tracking-[0.16em] text-muted uppercase">
            Private preview link
          </dt>
          <dd className="mt-1 break-all">
            <a
              href={previewUrl}
              className="text-accent underline underline-offset-4"
            >
              {previewUrl}
            </a>
            <span className="mt-1 block text-xs text-muted">
              Share this with anyone while you&apos;re still deciding. It works
              whether or not you&apos;ve paid.
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-xs tracking-[0.16em] text-muted uppercase">
            Public address
          </dt>
          <dd className="mt-1 break-all">
            {live ? (
              <a
                href={`/${site.slug}`}
                className="text-accent underline underline-offset-4"
              >
                {publicUrl}
              </a>
            ) : (
              <span className="text-muted">{publicUrl}</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-line pt-5">
        {!site.is_paid ? (
          <PaymentPanel site={site} />
        ) : (
          <form action={setPublished} className="flex flex-wrap items-center gap-4">
            <input type="hidden" name="site_id" value={site.id} />
            <input
              type="hidden"
              name="published"
              value={site.is_published ? "false" : "true"}
            />
            <button
              type="submit"
              className={
                site.is_published
                  ? "border border-line px-5 py-2.5 text-xs tracking-[0.18em] text-muted uppercase hover:border-accent hover:text-accent"
                  : "bg-accent px-6 py-3 text-xs tracking-[0.2em] text-white uppercase"
              }
            >
              {site.is_published ? "Take it private again" : "Publish my website"}
            </button>
            <span className="text-sm text-muted">
              {site.is_published
                ? "Anyone with the address can see it."
                : "Paid and ready. Publish whenever you like."}
            </span>
          </form>
        )}
      </div>
    </div>
  );
}
