import { BRAND, PRICE_LABEL } from "@/lib/env";

/**
 * The help chatbot's brain. It is not an AI model, it is a hand written
 * knowledge base plus a small scoring matcher (see matchQuery below). Every
 * answer here is checked against how the product actually behaves, so the
 * bot never invents a policy or a price. Facts that can drift (the price,
 * the brand name) are pulled from lib/env rather than typed out twice.
 *
 * Adding an entry: give it a stable id, the category, the question a person
 * would actually type, a short answer in the product's voice, and a `k`
 * string of extra trigger words the question itself might not contain.
 */

export type HelpCategory =
  | "pricing"
  | "start"
  | "account"
  | "editing"
  | "photos"
  | "address"
  | "publishing"
  | "privacy"
  | "themes"
  | "widgets"
  | "play"
  | "sharing"
  | "tech"
  | "refunds"
  | "trust"
  | "misc";

export type HelpLink = { label: string; href: string };

export type HelpEntry = {
  id: string;
  cat: HelpCategory;
  q: string;
  a: string;
  /** Extra trigger words, space separated, that the question may not spell out. */
  k: string;
  links?: HelpLink[];
};

export const CATEGORY_LABEL: Record<HelpCategory, string> = {
  pricing: "Pricing & payment",
  start: "Getting started",
  account: "Sign in & account",
  editing: "Editing your website",
  photos: "Photos",
  address: "Your web address",
  publishing: "Publishing & privacy",
  privacy: "Privacy & data",
  themes: "Themes & design",
  widgets: "Countdowns & timeline",
  play: "Free games & quizzes",
  sharing: "Sharing & gifting",
  tech: "Tech & troubleshooting",
  refunds: "Refunds",
  trust: "Trust & security",
  misc: "Other",
};

const START: HelpLink = { label: "Start free", href: "/login" };
const DEMO: HelpLink = { label: "See an example", href: "/demo" };
const PLAY: HelpLink = { label: "Free tools", href: "/play" };
const GAME: HelpLink = { label: "Play the game", href: "/play/game" };
const DASH: HelpLink = { label: "Your dashboard", href: "/dashboard" };
const PRIVACY: HelpLink = { label: "Privacy Policy", href: "/privacy" };
const TERMS: HelpLink = { label: "Terms", href: "/terms" };

export const KNOWLEDGE_BASE: HelpEntry[] = [
  // ---------------------------------------------------------------- pricing
  {
    id: "price-how-much",
    cat: "pricing",
    q: "How much does it cost?",
    a: `${PRICE_LABEL}, paid once. That is the whole price for a website you keep, with no monthly fee.`,
    k: "cost price pricing fee charge pay amount rate how much rupees pkr",
    links: [START],
  },
  {
    id: "price-one-time",
    cat: "pricing",
    q: "Is it a one-time payment or a subscription?",
    a: `One time. You pay ${PRICE_LABEL} once and the website stays online. There is no subscription and no renewal.`,
    k: "one time onetime single subscription recurring monthly yearly renew again",
  },
  {
    id: "price-hidden-fees",
    cat: "pricing",
    q: "Are there any hidden fees?",
    a: `No. ${PRICE_LABEL} covers building, hosting and your web address. Nothing is added later.`,
    k: "hidden extra surprise catch additional secret charges upsell",
  },
  {
    id: "price-free-to-build",
    cat: "pricing",
    q: "Can I build it for free first?",
    a: "Yes. Building and previewing your website is completely free. You only pay when you want to publish it at its public address.",
    k: "free trial try test build first before paying preview without paying",
    links: [START],
  },
  {
    id: "price-what-included",
    cat: "pricing",
    q: "What is included in the price?",
    a: "Your own web address with your names in it, unlimited photos, unlimited edits, every theme, the countdown and timeline widgets, and hosting for as long as the product runs.",
    k: "included included in get features what do i get value included price covers",
  },
  {
    id: "price-currency",
    cat: "pricing",
    q: "What currency is the price in?",
    a: `The price is in Pakistani Rupees: ${PRICE_LABEL}. Payment is by local bank transfer.`,
    k: "currency rupees pkr dollars usd inr conversion which money",
  },
  {
    id: "price-payment-method",
    cat: "pricing",
    q: "How do I pay?",
    a: "By bank transfer. When your website is ready you will see the account details on the payment screen, you send the transfer, then upload a screenshot of it.",
    k: "pay method how payment bank transfer card stripe paypal jazzcash easypaisa iban account",
  },
  {
    id: "price-no-card",
    cat: "pricing",
    q: "Do you accept credit cards?",
    a: "Not yet. Card and wallet payments are not set up in Pakistan, so payment is by bank transfer for now. Card support is planned.",
    k: "credit card debit visa mastercard stripe paypal wallet online payment gateway",
  },
  {
    id: "price-jazzcash",
    cat: "pricing",
    q: "Can I pay with JazzCash or Easypaisa?",
    a: "Bank transfer is the only method right now. If your wallet lets you send to a bank account (IBAN), that works too. Attach the screenshot after.",
    k: "jazzcash easypaisa sadapay nayapay wallet mobile account raast transfer",
  },
  {
    id: "price-confirm-time",
    cat: "pricing",
    q: "How long until my payment is confirmed?",
    a: "Usually within a day. A person checks each transfer by hand and unlocks publishing once it matches.",
    k: "confirm confirmation verify verified how long wait time approve manual check screenshot",
  },
  {
    id: "price-screenshot",
    cat: "pricing",
    q: "Why do I need to upload a payment screenshot?",
    a: "Bank transfers do not notify us automatically, so the screenshot is how we match your transfer to your website and unlock it.",
    k: "screenshot proof receipt upload why payment evidence transfer slip",
  },
  {
    id: "price-wrong-amount",
    cat: "pricing",
    q: "I sent the wrong amount, what now?",
    a: `Email mzaheen3307@gmail.com with your website name and what you sent. If it was short, send the difference. If it was over, we will sort out the balance.`,
    k: "wrong amount overpaid underpaid short extra mistake sent less more",
  },
  {
    id: "price-couple-websites",
    cat: "pricing",
    q: "Do I pay again for a second website?",
    a: `Each website is its own ${PRICE_LABEL} payment. One payment unlocks one website.`,
    k: "second another multiple two websites more than one again pay per",
  },
  {
    id: "price-gift-someone",
    cat: "pricing",
    q: "Can I pay for a friend's website as a gift?",
    a: "Yes. Build it or let them build it, then you cover the transfer. Put their website name in the payment note so it matches.",
    k: "gift pay for friend someone else on behalf cover their sponsor",
  },
  {
    id: "price-discount",
    cat: "pricing",
    q: "Is there a discount or coupon?",
    a: `There is one flat price, ${PRICE_LABEL}, with no codes to hunt for. It is already set below the cost of a dinner out.`,
    k: "discount coupon promo code voucher offer sale cheaper deal student",
  },
  {
    id: "price-why-worth",
    cat: "pricing",
    q: "Why does it cost anything at all?",
    a: "The fee covers hosting your photos and page for the long term, plus a person checking each payment and helping when something breaks.",
    k: "why pay worth justify expensive cost reason value charge",
  },
  {
    id: "price-increase",
    cat: "pricing",
    q: "Will the price go up later?",
    a: `The price may change for new websites over time. What you already paid is not billed again.`,
    k: "increase go up change future raise later locked grandfather",
  },
  {
    id: "price-invoice",
    cat: "pricing",
    q: "Can I get an invoice or receipt?",
    a: "Yes. Email mzaheen3307@gmail.com with your website name and we will send a simple receipt for the payment.",
    k: "invoice receipt bill proof of purchase document tax",
  },
  {
    id: "price-trial-length",
    cat: "pricing",
    q: "How long can I use it free before paying?",
    a: "There is no time limit. Your private preview link works for as long as you need. Payment is only for going public.",
    k: "trial length days free period expire limit how long unpaid preview",
  },
  {
    id: "price-pay-before-ready",
    cat: "pricing",
    q: "Can I pay before the website is finished?",
    a: "You can, but there is no reason to rush. Nothing about the website changes after payment except that the Publish button unlocks.",
    k: "pay early before ready finished done in advance prepay",
  },
  {
    id: "price-two-people-pay",
    cat: "pricing",
    q: "Do both partners need to pay?",
    a: "No. One payment covers the whole website. Only one of you needs an account and needs to pay.",
    k: "both partners two people share split cost each pay everyone",
  },
  {
    id: "price-family-plan",
    cat: "pricing",
    q: "Is there a plan for more than one couple?",
    a: "Not as a bundle yet. For now each website is a separate free build and a separate one time payment.",
    k: "family plan bulk multiple couples team bundle group agency reseller",
  },
  {
    id: "price-after-pay-what",
    cat: "pricing",
    q: "What happens right after I pay?",
    a: "Your screenshot goes into a queue, a person matches it, and within about a day the Publish button on your dashboard turns on.",
    k: "after payment next step what happens unlock publish enabled queue",
    links: [DASH],
  },
  {
    id: "price-refund-quick",
    cat: "pricing",
    q: "Can I get my money back?",
    a: "If your payment has not been confirmed yet, email us and we refund it, no questions asked. After the website is published the fee is not refundable, but we will fix anything wrong on our end.",
    k: "refund money back return cancel reverse chargeback",
    links: [TERMS],
  },
  {
    id: "price-taxes",
    cat: "pricing",
    q: "Are there taxes on top?",
    a: `No tax is added. The amount you transfer is exactly ${PRICE_LABEL}.`,
    k: "tax gst vat sales tax added on top extra levy",
  },

  // ------------------------------------------------------------------ start
  {
    id: "start-what-is",
    cat: "start",
    q: `What is ${BRAND}?`,
    a: `${BRAND} turns your photos, your story and your dates into a small website for the two of you, on its own web address you can share or give as a gift.`,
    k: "what is about product explain overview couples site website builder purpose",
    links: [DEMO],
  },
  {
    id: "start-who-for",
    cat: "start",
    q: "Who is this for?",
    a: "Couples. People use it for anniversaries, a birthday surprise, making a relationship official online, or just keeping the two of you in one place.",
    k: "who for audience use case couples anniversary boyfriend girlfriend partner spouse",
  },
  {
    id: "start-how-it-works",
    cat: "start",
    q: "How does it work?",
    a: "Three steps: enter your names and claim an address, drop in photos and write your story, then share the private link or publish it. No design skills needed.",
    k: "how works process steps setup build create getting started begin",
    links: [START],
  },
  {
    id: "start-how-long-build",
    cat: "start",
    q: "How long does it take to build one?",
    a: "Most people get a good first version done in ten to twenty minutes, then keep tweaking it over a few days before sharing.",
    k: "how long time take build minutes hours fast quick effort",
  },
  {
    id: "start-need-account",
    cat: "start",
    q: "Do I need an account?",
    a: "To build a website, yes, a free account with just your email. For the free games and quizzes at /play you need nothing at all.",
    k: "account sign up register needed required login email free",
    links: [PLAY],
  },
  {
    id: "start-design-skills",
    cat: "start",
    q: "I am not a designer, can I still make it look good?",
    a: "Yes. You pick a theme, add photos and text, and the layout is done for you. There is nothing to arrange or style by hand.",
    k: "design skills designer good looking layout hard difficult coding template",
  },
  {
    id: "start-example",
    cat: "start",
    q: "Can I see an example first?",
    a: "Yes, there is a full sample website with placeholder names and story so you can see the shape of it before you start.",
    k: "example sample demo preview see look show me what looks like",
    links: [DEMO],
  },
  {
    id: "start-mobile-build",
    cat: "start",
    q: "Can I build it on my phone?",
    a: "Yes. The whole editor works on a phone, including photo uploads from your camera roll.",
    k: "phone mobile build editor tablet ipad android iphone camera roll",
  },
  {
    id: "start-what-need",
    cat: "start",
    q: "What do I need to get started?",
    a: "An email address, your two names, and a handful of photos. Everything else you can add later.",
    k: "need start requirements bring prepare what to have ready begin",
  },
  {
    id: "start-partner-know",
    cat: "start",
    q: "Does my partner need to know I am making it?",
    a: "No. Most people build it quietly and send the link as a surprise. Your partner does not need an account to view it.",
    k: "partner know secret surprise hidden without them finding out quietly",
  },
  {
    id: "start-languages",
    cat: "start",
    q: "Can I write it in another language?",
    a: "Yes. You can type your story, captions and titles in any language. The buttons and labels stay in English for now.",
    k: "language urdu hindi arabic spanish non english translate multilingual script",
  },
  {
    id: "start-how-many-sections",
    cat: "start",
    q: "What sections can a website have?",
    a: "A hero with your names and date, your story, a photo gallery, a timeline of moments, a live countdown, and a date bucket list.",
    k: "sections parts pages blocks structure what can include layout contents",
  },
  {
    id: "start-blank-or-template",
    cat: "start",
    q: "Do I start from a template or a blank page?",
    a: "From a guided setup. It asks for your names, then your story, then photos, and assembles the page as you go.",
    k: "template blank start from scratch guided wizard setup form structure",
  },
  {
    id: "start-save-progress",
    cat: "start",
    q: "Is my progress saved as I go?",
    a: "Yes. Everything you enter in the editor is saved to your account, so you can close the tab and come back later.",
    k: "save progress autosave draft come back later resume lose work",
    links: [DASH],
  },
  {
    id: "start-change-mind-names",
    cat: "start",
    q: "Can I change the names later?",
    a: "You can change the display names any time before publishing. The web address itself locks once the website goes live.",
    k: "change names later edit rename display title update wrong name",
  },
  {
    id: "start-couple-not-married",
    cat: "start",
    q: "Do we have to be married to use it?",
    a: "No. It is for any couple at any stage: dating, engaged, married, long distance, all of it.",
    k: "married engaged dating relationship stage long distance girlfriend boyfriend requirement",
  },
  {
    id: "start-anniversary-idea",
    cat: "start",
    q: "Is this good for an anniversary gift?",
    a: "It is one of the most common uses. Build the timeline of your year quietly and send the link at midnight on the day.",
    k: "anniversary gift idea present surprise date celebrate year together",
  },
  {
    id: "start-birthday-idea",
    cat: "start",
    q: "Can I use it as a birthday gift?",
    a: "Yes. A page of your favourite photos, inside jokes and a countdown to their next trip makes a good birthday surprise.",
    k: "birthday gift present surprise idea celebrate",
  },
  {
    id: "start-proposal",
    cat: "start",
    q: "Can I use it for a proposal or to go public as a couple?",
    a: "Yes. People use a clean custom link in their bio to make a relationship official, or as part of a proposal reveal.",
    k: "proposal engagement reveal hard launch instagram bio official public relationship announce",
  },
  {
    id: "start-difference-social",
    cat: "start",
    q: "How is this different from just posting on Instagram?",
    a: "It is one calm page that is only about the two of you, on its own address, with no feed, no ads and no algorithm deciding who sees it.",
    k: "different instagram facebook social media feed why not just post compare",
  },

  // ---------------------------------------------------------------- account
  {
    id: "acct-how-sign-in",
    cat: "account",
    q: "How do I sign in?",
    a: "Enter your email and we send you a sign-in link. Click it and you are in. There is no password to set or remember.",
    k: "sign in log in login access enter account how password magic link email",
    links: [START],
  },
  {
    id: "acct-no-password",
    cat: "account",
    q: "Why is there no password?",
    a: "Passwords get forgotten and reused. A fresh link to your email is simpler and safer, so that is all we use.",
    k: "no password passwordless why magic link security forgot reset",
  },
  {
    id: "acct-link-not-arriving",
    cat: "account",
    q: "The sign-in email is not arriving.",
    a: "Check spam and promotions first. Give it two or three minutes. If it still has not come, request another from the sign-in screen.",
    k: "email not arriving received missing spam junk delay link never came resend",
  },
  {
    id: "acct-first-link-expired",
    cat: "account",
    q: "My first sign-in link says it expired.",
    a: "The link now lands on a page with a Confirm sign-in button, and the log-in only happens when you press it. If it still shows expired, just request a fresh link and use the newest email.",
    k: "expired first link invalid old used already scanner outlook confirm button broken",
  },
  {
    id: "acct-link-lifetime",
    cat: "account",
    q: "How long is the sign-in link valid?",
    a: "About an hour. After that, request a new one. Each link is single use.",
    k: "link valid expire lifetime how long hour minutes time limit single use",
  },
  {
    id: "acct-wrong-email",
    cat: "account",
    q: "I signed up with the wrong email.",
    a: "Sign in with the correct email instead, which starts a fresh account. If you already added website content under the wrong one, email mzaheen3307@gmail.com and we will move it.",
    k: "wrong email mistake typo different address change account switch move",
  },
  {
    id: "acct-change-email",
    cat: "account",
    q: "Can I change my account email?",
    a: "Not from the dashboard yet. Email mzaheen3307@gmail.com from the old address, tell us the new one, and we will switch it over.",
    k: "change email update account address switch new email move login",
  },
  {
    id: "acct-two-devices",
    cat: "account",
    q: "Can I sign in on more than one device?",
    a: "Yes. Sign in on your phone and your laptop both. Each just needs its own link from your email.",
    k: "multiple devices phone laptop desktop two computers stay signed in sessions",
  },
  {
    id: "acct-stay-signed-in",
    cat: "account",
    q: "Will I stay signed in?",
    a: "Yes, for a good while on the same browser. If you clear your browser data or use private mode, you will need a new link.",
    k: "stay signed in session logout automatically remember me persist cookies",
  },
  {
    id: "acct-sign-out",
    cat: "account",
    q: "How do I sign out?",
    a: "There is a sign-out option in your dashboard. On a shared computer, use it when you are done.",
    k: "sign out log out logout leave shared computer end session",
    links: [DASH],
  },
  {
    id: "acct-partner-account",
    cat: "account",
    q: "Can my partner have access to edit too?",
    a: "Shared editing is not built in yet. For now, sign in on a shared device or take turns with the same account email.",
    k: "partner access shared editing collaborate two editors both edit invite together",
  },
  {
    id: "acct-delete-account",
    cat: "account",
    q: "How do I delete my account?",
    a: "Email mzaheen3307@gmail.com from your account address and ask. We remove the account, the website and the photos tied to it.",
    k: "delete account remove close erase wipe data gdpr forget me",
    links: [PRIVACY],
  },
  {
    id: "acct-what-stored",
    cat: "account",
    q: "What does my account store?",
    a: "Your email, your website content and photos, an event date if you added one, and your payment screenshot if you paid.",
    k: "account store data hold keep information saved what does have",
    links: [PRIVACY],
  },
  {
    id: "acct-forgot-which-email",
    cat: "account",
    q: "I forgot which email I used.",
    a: "Try the ones you use most and request a link for each. Only the right one will have your website behind it. Still stuck, email mzaheen3307@gmail.com.",
    k: "forgot email which account lost cannot remember address recover",
  },
  {
    id: "acct-link-opens-wrong",
    cat: "account",
    q: "The sign-in link opens then bounces me back to the sign-in page.",
    a: "That usually means the link was already used or too old. Request a new one and open it in the same browser you asked from, not a preview window inside your email app.",
    k: "link bounces redirect loop back to login not working opens then logs out browser",
  },
  {
    id: "acct-safe-to-click",
    cat: "account",
    q: "Is the sign-in link safe to click?",
    a: "Yes, as long as the email is the one you just requested and it comes from our sending address. It only signs you in, nothing else.",
    k: "safe click phishing scam legit real trust link email security",
  },

  // ---------------------------------------------------------------- editing
  {
    id: "edit-where",
    cat: "editing",
    q: "Where do I edit my website?",
    a: "From your dashboard. Open the website and you land in the editor, where each section has its own panel.",
    k: "edit where editor dashboard change update manage panel find",
    links: [DASH],
  },
  {
    id: "edit-after-publish",
    cat: "editing",
    q: "Can I edit after the website is published?",
    a: "Yes. Photos, story, timeline and countdown stay editable forever. Only the web address is fixed once it is live.",
    k: "edit after publish live change published update locked still edit forever",
  },
  {
    id: "edit-story",
    cat: "editing",
    q: "How do I write or change our story?",
    a: "In the story panel of the editor. Type freely, save, and it updates on the page. There is no length limit that matters.",
    k: "story write text about us paragraph description bio words change edit",
  },
  {
    id: "edit-story-length",
    cat: "editing",
    q: "How long can the story be?",
    a: "As long as you like. A few short paragraphs reads best, but nothing stops you writing more.",
    k: "story length limit words characters how much long maximum",
  },
  {
    id: "edit-timeline-add",
    cat: "editing",
    q: "How do I add a moment to the timeline?",
    a: "Open the timeline editor and add an entry with a date and a short line about what happened. Repeat for each moment. The section stays hidden until you add the first one.",
    k: "timeline add moment milestone event date entry history story line",
  },
  {
    id: "edit-timeline-order",
    cat: "editing",
    q: "Can I reorder timeline moments?",
    a: "They sort by the date you give each one, so fixing a date fixes the order.",
    k: "timeline order sort reorder rearrange sequence dates wrong order",
  },
  {
    id: "edit-remove-section",
    cat: "editing",
    q: "Can I hide a section I do not want?",
    a: "Yes. Leave the timeline empty and it stays hidden. Sections without content do not show on the page.",
    k: "hide remove section delete turn off empty skip not show timeline countdown",
  },
  {
    id: "edit-event-date",
    cat: "editing",
    q: "How do I set our anniversary or event date?",
    a: "In the details panel. That date feeds the countdown and the days-together counter.",
    k: "event date anniversary set countdown when day together first date wedding",
  },
  {
    id: "edit-change-date",
    cat: "editing",
    q: "Can I change the event date later?",
    a: "Yes, any time, before or after publishing. The countdown updates straight away.",
    k: "change date event anniversary edit update wrong date fix countdown",
  },
  {
    id: "edit-preview-changes",
    cat: "editing",
    q: "Can I preview changes before they go live?",
    a: "Yes. The private preview link always shows your latest saved version, published or not.",
    k: "preview changes before live see draft check test private link staging",
  },
  {
    id: "edit-undo",
    cat: "editing",
    q: "Is there an undo if I delete something?",
    a: "There is no version history yet, so deletes are permanent. Copy longer text somewhere safe before big changes.",
    k: "undo revert history version restore deleted mistake recover rollback backup",
  },
  {
    id: "edit-formatting",
    cat: "editing",
    q: "Can I use bold, links or emoji in the text?",
    a: "Emoji work anywhere. Rich formatting like bold and inline links is not in the text fields yet, the layout handles the styling for you.",
    k: "formatting bold italic links emoji rich text markdown styling font size",
  },
  {
    id: "edit-multiple-websites",
    cat: "editing",
    q: "Can I have more than one website on my account?",
    a: "Yes. Your dashboard lists each one, and each is its own separate payment to publish.",
    k: "multiple websites more than one several projects manage list dashboard",
    links: [DASH],
  },
  {
    id: "edit-collab",
    cat: "editing",
    q: "Can two of us edit at the same time?",
    a: "Editing at the same moment on two devices can overwrite each other. Take turns for now.",
    k: "same time simultaneous two editors conflict overwrite collaborate live together",
  },
  {
    id: "edit-titles",
    cat: "editing",
    q: "Can I rename the section headings?",
    a: "The main headings are fixed for now so the layout stays clean. Your names, story and captions are all yours to write.",
    k: "rename headings titles section labels custom heading change words",
  },
  {
    id: "edit-spacing",
    cat: "editing",
    q: "Can I move sections around or change the layout?",
    a: "The order is fixed and tuned to read well on a phone. You control the content, the theme and the photos, not the arrangement.",
    k: "layout move sections rearrange order custom design drag drop position arrange",
  },
  {
    id: "edit-see-live-version",
    cat: "editing",
    q: "How do I know what the public version looks like right now?",
    a: "Open your public address in a private browser window. That shows exactly what a visitor sees.",
    k: "live version public what visitors see check current published incognito",
  },
  {
    id: "edit-lost-work",
    cat: "editing",
    q: "I made changes and they did not save.",
    a: "Each panel saves when you confirm it. If a save failed, check your connection and try again. Unsaved text in an open field is the usual thing that gets lost.",
    k: "lost work not saved save failed changes gone disappeared connection error",
  },

  // ----------------------------------------------------------------- photos
  {
    id: "photo-how-add",
    cat: "photos",
    q: "How do I add photos?",
    a: "In the photo panel, drag them in or pick them from your camera roll. They upload and appear in the gallery.",
    k: "add photos upload pictures images gallery camera roll drag drop insert",
  },
  {
    id: "photo-how-many",
    cat: "photos",
    q: "How many photos can I upload?",
    a: "Unlimited. Add as many as you want and remove the ones that do not make the cut later.",
    k: "how many photos limit maximum number unlimited count cap upload",
  },
  {
    id: "photo-file-types",
    cat: "photos",
    q: "What photo formats are supported?",
    a: "Common ones like JPG, PNG and HEIC from a phone. If a file will not upload, export it as JPG and try again.",
    k: "format file type jpg jpeg png heic webp raw supported accepted upload",
  },
  {
    id: "photo-size-limit",
    cat: "photos",
    q: "Is there a file size limit for photos?",
    a: "Very large files can be slow or fail on a weak connection. Photos straight from a phone are fine. If one struggles, shrink it a little first.",
    k: "size limit file big large mb megabytes too large fail slow compress",
  },
  {
    id: "photo-order",
    cat: "photos",
    q: "Can I reorder the photos?",
    a: "Yes, arrange them in the photo panel and the gallery follows that order.",
    k: "reorder photos order sort arrange sequence first photo cover rearrange",
  },
  {
    id: "photo-captions",
    cat: "photos",
    q: "Can I add captions to photos?",
    a: "Yes. Each photo has a caption field for a short line underneath it.",
    k: "caption photo text label describe under photo words title",
  },
  {
    id: "photo-delete",
    cat: "photos",
    q: "How do I delete a photo?",
    a: "Remove it from the photo panel. It comes off the gallery straight away. Deleted photos are not kept.",
    k: "delete photo remove take down get rid unwanted picture",
  },
  {
    id: "photo-replace",
    cat: "photos",
    q: "Can I swap a photo for a better version?",
    a: "Delete the old one and upload the new one. There is no in place replace yet.",
    k: "replace swap change photo update better version overwrite",
  },
  {
    id: "photo-quality",
    cat: "photos",
    q: "Will my photos lose quality?",
    a: "They are resized for fast loading on a phone, which is a small change most people never notice. Keep your originals as the masters.",
    k: "quality resolution compress lose sharp blurry pixelated resize original",
  },
  {
    id: "photo-privacy",
    cat: "photos",
    q: "Who can see my uploaded photos?",
    a: "Only people with your link. Before you publish and pay, that is just you. Photos are not public or searchable.",
    k: "photos private who sees visible public searchable google index leak",
    links: [PRIVACY],
  },
  {
    id: "photo-download-back",
    cat: "photos",
    q: "Can I download my photos back later?",
    a: "You can save each one from the gallery. Keep your camera roll originals as the real backup, since resized copies are what the page stores.",
    k: "download photos back export get my pictures save retrieve backup originals",
  },
  {
    id: "photo-cover",
    cat: "photos",
    q: "How do I choose the main photo at the top?",
    a: "The first photo in your order is used as the hero image. Move the one you want to the front.",
    k: "cover main photo hero top banner first featured header background",
  },
  {
    id: "photo-video",
    cat: "photos",
    q: "Can I add a video?",
    a: "Not yet. The gallery is photos only for now. Video support is on the list.",
    k: "video clip mp4 movie reel upload add moving picture",
  },
  {
    id: "photo-upload-failing",
    cat: "photos",
    q: "My photo upload keeps failing.",
    a: "Try one photo at a time, on a stronger connection, and export very large or unusual files as JPG. If it still fails, note the file and email mzaheen3307@gmail.com.",
    k: "upload failing error stuck not working fails photo picture broken retry",
  },

  // ---------------------------------------------------------------- address
  {
    id: "addr-what-is",
    cat: "address",
    q: "What will our web address look like?",
    a: "Your names in a clean link, like ourslove.site/zara-and-alina. You choose the part with your names when you set the website up.",
    k: "web address url link domain name slug looks like format path",
  },
  {
    id: "addr-choose",
    cat: "address",
    q: "How do I choose our web address?",
    a: "In the first step you type the name part. Use three to sixty characters, letters, numbers and dashes. If it is taken, pick another.",
    k: "choose address url slug pick claim name set custom link handle",
  },
  {
    id: "addr-change-later",
    cat: "address",
    q: "Can I change the web address after publishing?",
    a: "No. It locks when the website goes live so shared links never break. Pick one you are happy with before you publish.",
    k: "change address url after publish locked fixed rename edit different link",
  },
  {
    id: "addr-taken",
    cat: "address",
    q: "The address I want is taken.",
    a: "Add a middle initial, swap the order of your names, or add your anniversary year. Small changes usually free one up.",
    k: "taken unavailable already used name in use conflict someone has it",
  },
  {
    id: "addr-own-domain",
    cat: "address",
    q: "Can I use my own domain name?",
    a: "Not yet. Every website lives on the shared address with your names in the path. A custom domain option may come later.",
    k: "own domain custom buy connect godaddy namecheap cname dns bring your own",
  },
  {
    id: "addr-rules",
    cat: "address",
    q: "What characters can the address use?",
    a: "Lowercase letters, numbers and dashes, three to sixty characters. Spaces and symbols are not allowed.",
    k: "characters allowed rules valid address slug format letters numbers dashes spaces",
  },
  {
    id: "addr-reserved",
    cat: "address",
    q: "Why was my chosen name rejected?",
    a: "A few words like login, admin, help and support are reserved for the app itself. Pick a name that is actually yours.",
    k: "rejected not allowed reserved blocked forbidden name error invalid word",
  },
  {
    id: "addr-case",
    cat: "address",
    q: "Does capitalisation matter in the address?",
    a: "No. Addresses are lowercase, so Zara-And-Alina and zara-and-alina lead to the same page.",
    k: "capital uppercase lowercase case sensitive letters address url matters",
  },
  {
    id: "addr-share-before-pay",
    cat: "address",
    q: "Can I share the address before I pay?",
    a: "The public address only works after payment and publishing. Before that, share the private preview link, which shows the same page.",
    k: "share address before pay preview link private public works unpaid send",
  },
  {
    id: "addr-domain-registered",
    cat: "address",
    q: "Is ourslove.site the final domain?",
    a: "It is the address the product is moving to. If it is still loading on a different link when you visit, your shared links will keep working after the switch.",
    k: "ourslove domain final official real address which url production live",
  },
  {
    id: "addr-multiple-names",
    cat: "address",
    q: "We both go by nicknames, can the address use those?",
    a: "Yes. The name part is free text within the rules, so nicknames, initials or a shared word all work.",
    k: "nickname initials names address custom what to put pet name short",
  },
  {
    id: "addr-seo",
    cat: "address",
    q: "Will our page show up on Google?",
    a: "Only if you publish it and make it public. A private or unpublished page is not indexed. Even public, it is a small personal page, not something that ranks for searches.",
    k: "google search seo index show up findable searchable ranking discoverable",
  },
  {
    id: "addr-typo-after-live",
    cat: "address",
    q: "I published with a typo in the address.",
    a: "Email mzaheen3307@gmail.com right away with the current address and the fix. The sooner it is caught, the safer it is to change before anyone has the link.",
    k: "typo mistake address wrong spelling published live fix error url",
  },

  // ------------------------------------------------------------- publishing
  {
    id: "pub-how",
    cat: "publishing",
    q: "How do I publish my website?",
    a: "Once your payment is confirmed, the Publish button in your dashboard turns on. Press it and the public address goes live.",
    k: "publish go live release make public turn on button how launch",
    links: [DASH],
  },
  {
    id: "pub-need-pay",
    cat: "publishing",
    q: "Do I have to pay to publish?",
    a: `Yes. Building and previewing are free. Publishing at the public address needs the one time ${PRICE_LABEL} payment.`,
    k: "pay to publish free publish cost required payment before live gate",
  },
  {
    id: "pub-unpublish",
    cat: "publishing",
    q: "Can I unpublish or make it private again?",
    a: "Yes. There is a private toggle in the publish panel. Switch it and the public address stops serving the page until you turn it back on.",
    k: "unpublish private again take offline hide pause disable public toggle off",
  },
  {
    id: "pub-private-link",
    cat: "publishing",
    q: "What is the private preview link?",
    a: "An unguessable link tied to your website that shows the current version to anyone you send it to, without publishing. Good for a surprise reveal.",
    k: "private preview link unlisted secret share draft unpublished token url",
  },
  {
    id: "pub-who-sees-unpublished",
    cat: "publishing",
    q: "Can anyone find my website before I publish?",
    a: "No. It sits behind a private link only you have. It is not listed, linked or indexed anywhere.",
    k: "before publish private who sees find unpublished hidden safe secret leak",
    links: [PRIVACY],
  },
  {
    id: "pub-difference-preview-public",
    cat: "publishing",
    q: "What is the difference between the preview link and the public address?",
    a: "The preview link always works and is meant for you and a surprise reveal. The public address is the clean one with your names, and it only works after you publish.",
    k: "difference preview public address link which one send two urls compare",
  },
  {
    id: "pub-schedule",
    cat: "publishing",
    q: "Can I schedule it to go live at a certain time?",
    a: "Not automatically yet. What people do is keep it private, then send the preview link exactly at midnight, and publish the public one whenever.",
    k: "schedule timer go live at time midnight automatic delay launch date",
  },
  {
    id: "pub-changes-after-live",
    cat: "publishing",
    q: "If I edit after publishing, do changes go live immediately?",
    a: "Yes. Saved changes show on the public page right away. There is no second publish step for edits.",
    k: "edit after publish live immediately changes update instant republish save",
  },
  {
    id: "pub-take-down",
    cat: "publishing",
    q: "Can I take the website down for good?",
    a: "Yes. Set it private to hide it, or email mzaheen3307@gmail.com to delete the website and its photos entirely.",
    k: "take down delete permanently remove website shut close destroy erase",
  },
  {
    id: "pub-visitors-count",
    cat: "publishing",
    q: "Can I see how many people visited?",
    a: "There are no visitor analytics in the product. It is a private keepsake, not a page to track.",
    k: "visitors count analytics stats views traffic who visited seen numbers",
  },
  {
    id: "pub-password-protect",
    cat: "publishing",
    q: "Can I password protect the public page?",
    a: "Not with a password. The privacy control is the private link before publishing, and the private toggle after. A published public page is open to anyone with the address.",
    k: "password protect lock public page gate restrict access private toggle visitors",
  },
  {
    id: "pub-remove-from-google",
    cat: "publishing",
    q: "I published then changed my mind, how do I get it off Google?",
    a: "Set it private in the publish panel so the page stops loading. Search engines drop pages that no longer resolve over time.",
    k: "remove google search deindex changed mind private hide take off results",
  },

  // ----------------------------------------------------------------- privacy
  {
    id: "priv-who-sees",
    cat: "privacy",
    q: "Who can see our website?",
    a: "Only people you send the link to. Nothing is public until you publish, and even then it is a private personal page, not listed anywhere.",
    k: "who sees privacy visible public access private safe strangers view",
    links: [PRIVACY],
  },
  {
    id: "priv-sell-data",
    cat: "privacy",
    q: "Do you sell my data?",
    a: "No. Your information is used only to run the product. It is not sold, not used for ads, and not shared with data brokers.",
    k: "sell data privacy share third party advertising brokers marketing tracking",
    links: [PRIVACY],
  },
  {
    id: "priv-where-stored",
    cat: "privacy",
    q: "Where is my data stored?",
    a: "With Supabase, the database and file storage provider behind the product. Your account, page content, photos and any payment screenshot live there.",
    k: "where stored data hosting server supabase database location country cloud",
    links: [PRIVACY],
  },
  {
    id: "priv-ads",
    cat: "privacy",
    q: "Are there ads on my website?",
    a: "No. There are no ads anywhere, on your page or in the editor, and no ad tracking.",
    k: "ads advertising banners sponsored tracking pixels marketing on page",
  },
  {
    id: "priv-cookies",
    cat: "privacy",
    q: "Do you use tracking cookies?",
    a: "No advertising cookies and no cross-site tracking. Only the basics needed to keep you signed in.",
    k: "cookies tracking consent banner gdpr analytics third party sign in",
    links: [PRIVACY],
  },
  {
    id: "priv-partner-consent",
    cat: "privacy",
    q: "My partner did not consent to a page about them, is that a problem?",
    a: "Keep it private and personal, which is the normal use. Do not publish content meant to impersonate or harass someone without their consent. See the terms.",
    k: "consent partner permission privacy without knowing publish photos rights harass",
    links: [TERMS],
  },
  {
    id: "priv-data-request",
    cat: "privacy",
    q: "How do I request a copy of my data?",
    a: "Email mzaheen3307@gmail.com from your account address. We will send what is stored for your account.",
    k: "data request copy export download my information access gdpr subject",
    links: [PRIVACY],
  },
  {
    id: "priv-play-data",
    cat: "privacy",
    q: "What does the free /play tool store?",
    a: "Only what you type into it: the title, list items and quiz questions. If a guest plays your quiz, the name and score they enter. No account, no email.",
    k: "play data store privacy bucket list quiz what saved guests scores anonymous",
    links: [PLAY],
  },
  {
    id: "priv-delete-everything",
    cat: "privacy",
    q: "If I delete my account, is everything really gone?",
    a: "Yes. The account, the website content and the photos tied to it are removed. Keep your own copies of anything irreplaceable first.",
    k: "delete account everything gone permanent erase wiped removed data backup",
  },
  {
    id: "priv-encrypted",
    cat: "privacy",
    q: "Is my data encrypted?",
    a: "Traffic to the site is over HTTPS, and storage is handled by Supabase with encryption at rest. Your private link is the main thing keeping the page unlisted.",
    k: "encrypted encryption https ssl secure at rest data protection safe",
  },
  {
    id: "priv-share-with-vendors",
    cat: "privacy",
    q: "Who else can access my content?",
    a: "The people you share the link with, and the hosting provider that stores it. No one buys or receives your data beyond running the service.",
    k: "who access content third party vendors staff employees see my page provider",
    links: [PRIVACY],
  },

  // ------------------------------------------------------------------ themes
  {
    id: "theme-what",
    cat: "themes",
    q: "What themes are available?",
    a: "A default warm look plus blush, midnight, sage and gold. Each sets the colours, paper tone and accent for the whole page.",
    k: "themes colors palette styles options looks blush midnight sage gold dark",
  },
  {
    id: "theme-dark",
    cat: "themes",
    q: "Is there a dark theme?",
    a: "Yes. Midnight is the dark one, with a deep background and a warm gold accent.",
    k: "dark theme night mode black midnight dark background light",
  },
  {
    id: "theme-change",
    cat: "themes",
    q: "How do I change the theme?",
    a: "Pick it in the editor. The whole page updates instantly, before and after publishing.",
    k: "change theme switch pick select color palette update different look",
  },
  {
    id: "theme-custom-color",
    cat: "themes",
    q: "Can I pick my own custom colours?",
    a: "Not a free colour picker. You choose one of the five themes, each tuned so the page always looks finished.",
    k: "custom color hex own colours picker brand palette specific shade choose",
  },
  {
    id: "theme-fonts",
    cat: "themes",
    q: "Can I change the fonts?",
    a: "The fonts are set as part of the design, a serif for headings and a clean sans for body text. They are not adjustable.",
    k: "font typeface change text style family serif sans custom typography",
  },
  {
    id: "theme-preview-all",
    cat: "themes",
    q: "Can I preview every theme before choosing?",
    a: "Yes. Switch between them in the editor and watch the page change. It costs nothing to try each one.",
    k: "preview themes try all compare see each switch test before choosing",
  },
  {
    id: "theme-per-section",
    cat: "themes",
    q: "Can different sections have different themes?",
    a: "No. One theme applies to the whole page so it reads as a single piece.",
    k: "per section different themes mix multiple parts vary each section separate",
  },
  {
    id: "theme-match-photos",
    cat: "themes",
    q: "Which theme goes best with my photos?",
    a: "Warm and gold suit sunny outdoor photos, blush suits soft indoor ones, sage is calm and neutral, midnight makes bright photos pop. Try a few.",
    k: "which theme best photos match recommend suit choose good looks colour",
  },

  // ----------------------------------------------------------------- widgets
  {
    id: "widget-countdown",
    cat: "widgets",
    q: "How does the countdown work?",
    a: "Set an event date in the editor and the page shows a live countdown to it, plus a running count of days you have been together.",
    k: "countdown timer clock days until event live counter anniversary trip",
  },
  {
    id: "widget-days-together",
    cat: "widgets",
    q: "Can it show how long we have been together?",
    a: "Yes. Give it your start date and the page shows the number of days since, updating on its own.",
    k: "days together how long counter since first date relationship length running total",
  },
  {
    id: "widget-multiple-countdowns",
    cat: "widgets",
    q: "Can I have more than one countdown?",
    a: "One main event countdown for now. The date bucket list is where you keep the other upcoming plans.",
    k: "multiple countdowns several timers many events more than one two dates",
  },
  {
    id: "widget-bucket-on-site",
    cat: "widgets",
    q: "What is the date bucket list on the website?",
    a: "A list of things you want to do together that lives on your page, so visitors and the two of you can see what is planned and what is done.",
    k: "bucket list date ideas things to do plans wishlist on site website goals",
  },
  {
    id: "widget-bucket-check",
    cat: "widgets",
    q: "Can we tick off bucket list items as we do them?",
    a: "Yes. Mark an item done in the editor and it shows as completed on the page.",
    k: "tick check off bucket list done completed mark finished cross out strike",
  },
  {
    id: "widget-timeline-vs-bucket",
    cat: "widgets",
    q: "What is the difference between the timeline and the bucket list?",
    a: "The timeline is the past, moments that already happened with dates. The bucket list is the future, things you still want to do.",
    k: "timeline vs bucket list difference past future which one moments plans",
  },
  {
    id: "widget-countdown-past",
    cat: "widgets",
    q: "What happens to the countdown after the date passes?",
    a: "It flips to counting up from the event, so an anniversary keeps showing how long it has been.",
    k: "countdown after date passed over past event finished expired count up negative",
  },
  {
    id: "widget-timezone",
    cat: "widgets",
    q: "Which time zone does the countdown use?",
    a: "It counts by calendar date, so it lines up with the day wherever the viewer is, without fussing over the hour.",
    k: "timezone time zone countdown clock hours utc local viewer accurate",
  },

  // -------------------------------------------------------------------- play
  {
    id: "play-what",
    cat: "play",
    q: "What are the free games and quizzes?",
    a: "Three quick things at /play: a shareable bucket list, a how well do you know us quiz, and a Who's More Likely couple game. No account, no payment.",
    k: "play free games quizzes tools what are bucket list quiz couple game fun",
    links: [PLAY],
  },
  {
    id: "play-free-really",
    cat: "play",
    q: "Are the /play tools really free?",
    a: "Yes, fully free with no sign-up and no account. They exist to be shared in seconds.",
    k: "play free really cost hidden payment account sign up catch charge",
    links: [PLAY],
  },
  {
    id: "play-need-account",
    cat: "play",
    q: "Do I need an account for the games?",
    a: "No. You make one, get a link, and send it. Nothing to register.",
    k: "play account sign up login needed register required games quiz email",
  },
  {
    id: "play-bucket-make",
    cat: "play",
    q: "How do I make a bucket list?",
    a: "Go to /play, give it a title, add your items, and share the link. Your partner opens the same list and can check things off.",
    k: "make bucket list create how start play items title share checklist",
    links: [PLAY],
  },
  {
    id: "play-quiz-make",
    cat: "play",
    q: "How do I make a how well do you know us quiz?",
    a: "On /play, write your questions and answers, then share the link. Whoever plays gets a score at the end.",
    k: "make quiz create how well do you know us questions answers share score",
    links: [PLAY],
  },
  {
    id: "play-game-what",
    cat: "play",
    q: "What is the Who's More Likely game?",
    a: "Twenty questions like who gets angry first, who approached first, who loves more. You each tap a name, and it tallies who got picked for what.",
    k: "who is more likely game couple questions twenty tap names angry approached loves",
    links: [GAME],
  },
  {
    id: "play-game-questions",
    cat: "play",
    q: "What kind of questions are in the couple game?",
    a: "Light relationship ones: who says sorry first, who falls asleep first, who is messier, who plans the dates. Twenty in total.",
    k: "couple game questions list examples what topics kind about relationship",
    links: [GAME],
  },
  {
    id: "play-game-players",
    cat: "play",
    q: "How many people play the couple game?",
    a: "It is built for two, on one phone, passing it back and forth or answering together.",
    k: "how many players couple game two people one phone together pass device",
  },
  {
    id: "play-save-results",
    cat: "play",
    q: "Can I save the game or quiz results?",
    a: "Take a screenshot of the result screen. To keep it as part of something lasting, the result screen links you to building a gift website.",
    k: "save results score screenshot keep record history game quiz outcome store",
  },
  {
    id: "play-edit-later",
    cat: "play",
    q: "Can I edit my bucket list or quiz after making it?",
    a: "Yes, using the edit link you get when you create it. That link is the only way back in, so keep it.",
    k: "edit bucket list quiz after change update add remove edit link recover",
  },
  {
    id: "play-lost-link",
    cat: "play",
    q: "I lost the edit link to my bucket list.",
    a: "Because there is no login on /play, a lost edit link cannot be recovered. You would need to make a fresh list.",
    k: "lost link bucket list quiz recover forgot edit url gone cannot access",
    links: [TERMS],
  },
  {
    id: "play-share-where",
    cat: "play",
    q: "Where can I share the game or quiz link?",
    a: "Anywhere you send a link: a chat, a story, a text. Whoever opens it plays in the browser, nothing to install.",
    k: "share where game quiz link whatsapp instagram story text send post",
  },
  {
    id: "play-into-website",
    cat: "play",
    q: "Can I move my /play bucket list into a paid website?",
    a: "The website has its own date bucket list you fill in when building it. There is no automatic import, but copying items across takes a minute.",
    k: "move import play bucket list into website transfer copy paid upgrade combine",
  },
  {
    id: "play-anonymous",
    cat: "play",
    q: "Is the /play stuff anonymous?",
    a: "There is no account and no email. It stores only what you type and, for a quiz, the name and score a guest enters.",
    k: "anonymous play private tracked identity email account who knows data",
    links: [PRIVACY],
  },
  {
    id: "play-good-for-long-distance",
    cat: "play",
    q: "Are the games good for long distance?",
    a: "The quiz and bucket list work well apart, since you share a link and compare. The Who's More Likely game is best on one phone together.",
    k: "long distance games quiz remote apart online together far away play",
  },
  {
    id: "play-difference-from-website",
    cat: "play",
    q: "How are the free tools different from the paid website?",
    a: "The tools are single throwaway links with no account. The website is a lasting page with your photos, story, address and countdowns.",
    k: "difference free tools paid website compare versus play what extra worth",
  },

  // --------------------------------------------------------------- sharing
  {
    id: "share-how",
    cat: "sharing",
    q: "How do I share the website?",
    a: "Copy the link and send it however you like, a text, a chat, a story. The person who opens it just needs the link, no account.",
    k: "share how send link give partner friends copy url distribute",
  },
  {
    id: "share-surprise",
    cat: "sharing",
    q: "How do people give this as a surprise?",
    a: "Build it privately, then send the private preview link at a moment that matters, like midnight on the anniversary or over breakfast on their birthday.",
    k: "surprise gift reveal how give moment midnight anniversary birthday send timing",
  },
  {
    id: "share-viewer-account",
    cat: "sharing",
    q: "Does the person I share with need an account?",
    a: "No. Anyone with the link can view the page. Accounts are only for building.",
    k: "viewer account needed sign up recipient partner friend view login required",
  },
  {
    id: "share-social",
    cat: "sharing",
    q: "Can I put the link in my Instagram or TikTok bio?",
    a: "Yes, once it is published. The public address is a clean link with your names, made to sit in a bio.",
    k: "instagram tiktok bio social link post story public share hard launch",
  },
  {
    id: "share-preview-card",
    cat: "sharing",
    q: "Does the link show a nice preview when I paste it?",
    a: "Yes. Pasting it in a chat shows a card with the brand mark and a title, rather than a bare URL.",
    k: "preview card link unfurl thumbnail image chat paste og whatsapp imessage",
  },
  {
    id: "share-qr",
    cat: "sharing",
    q: "Can I get a QR code for the website?",
    a: "There is no built-in QR generator. Any free QR tool will turn your public address into a code you can print on a card.",
    k: "qr code scan print card generate link physical gift barcode",
  },
  {
    id: "share-print",
    cat: "sharing",
    q: "Can I print the website?",
    a: "It is made for screens, not print. For a physical keepsake, screenshot the sections you want, or take photos of the page on a phone.",
    k: "print physical paper book pdf export printout keepsake hard copy",
  },
  {
    id: "share-take-back",
    cat: "sharing",
    q: "Can I stop someone seeing it after I shared the link?",
    a: "Set the website private in the publish panel. The link stops loading the page until you make it public again.",
    k: "revoke stop sharing take back unshare block someone remove access private",
  },
  {
    id: "share-multiple-people",
    cat: "sharing",
    q: "Can I share it with the whole family?",
    a: "Yes. One link works for everyone. Send it to as many people as you want once it is published.",
    k: "family friends everyone group many people share wide public announcement",
  },
  {
    id: "share-link-changes",
    cat: "sharing",
    q: "If I edit the page, does the link stay the same?",
    a: "Yes. The link never changes once the website is live, so anything you already sent keeps working.",
    k: "link stays same edit changes break old link still works permanent url",
  },

  // -------------------------------------------------------------------- tech
  {
    id: "tech-mobile",
    cat: "tech",
    q: "Does the website work on phones?",
    a: "Yes. It is built phone first and looks close to a native app on any modern phone, as well as on tablets and desktops.",
    k: "mobile phone responsive android iphone tablet desktop works display screen",
  },
  {
    id: "tech-browsers",
    cat: "tech",
    q: "Which browsers are supported?",
    a: "Current versions of Chrome, Safari, Firefox and Edge. Very old browsers may look off.",
    k: "browser supported chrome safari firefox edge compatibility works old version",
  },
  {
    id: "tech-app",
    cat: "tech",
    q: "Is there a mobile app to download?",
    a: "No app to install. It all runs in the browser. You can add the page to your home screen if you want an icon.",
    k: "app download install play store app store native ios android home screen",
  },
  {
    id: "tech-offline",
    cat: "tech",
    q: "Does it work offline?",
    a: "No. The page and its photos load from the internet, so a connection is needed to view or edit.",
    k: "offline no internet connection work without wifi cached download local",
  },
  {
    id: "tech-slow-loading",
    cat: "tech",
    q: "My website loads slowly.",
    a: "Usually a lot of very large photos. Remove any you do not need, and the page will speed up. A weak connection also plays a part.",
    k: "slow loading lag performance takes long time speed heavy photos laggy",
  },
  {
    id: "tech-page-broken",
    cat: "tech",
    q: "Something on the page looks broken.",
    a: "Refresh once, and try a private window to rule out an old cached copy. If it still looks wrong, email mzaheen3307@gmail.com with a screenshot and your address.",
    k: "broken layout glitch bug display wrong messed up not rendering error visual",
  },
  {
    id: "tech-photos-not-showing",
    cat: "tech",
    q: "My photos are not showing on the live page.",
    a: "Give recent uploads a moment, then hard refresh. If a specific photo never appears, delete and re-upload it, and export it as JPG first if it is unusual.",
    k: "photos not showing missing blank broken image live page gallery empty load",
  },
  {
    id: "tech-editor-not-saving",
    cat: "tech",
    q: "The editor will not save my changes.",
    a: "Check your connection, then confirm the panel again. If a save keeps failing, note which panel and email mzaheen3307@gmail.com.",
    k: "editor not saving save fails changes lost error stuck spinner cannot save",
  },
  {
    id: "tech-cant-open",
    cat: "tech",
    q: "The site will not load at all for me.",
    a: "Try another network or device to see if it is local. If the whole site is down for you everywhere, email mzaheen3307@gmail.com so we can check.",
    k: "cannot open site down not loading blank white screen unreachable outage",
  },
  {
    id: "tech-data-usage",
    cat: "tech",
    q: "Will viewing the site use a lot of mobile data?",
    a: "Photos are the bulk of it and they are resized for phones. A single visit is light. Building with many uploads on mobile data adds up faster.",
    k: "data usage mobile bandwidth mb cost expensive viewing loading photos cellular",
  },
  {
    id: "tech-accessibility",
    cat: "tech",
    q: "Is the website accessible?",
    a: "It uses real headings, good contrast in every theme, and respects reduced motion settings. Screen readers can move through it.",
    k: "accessibility screen reader contrast a11y disabled motion reduce keyboard navigation",
  },
  {
    id: "tech-uptime",
    cat: "tech",
    q: "How reliable is the hosting?",
    a: "It aims to stay up steadily, but there is no uptime guarantee. Keep your own copies of anything irreplaceable.",
    k: "uptime reliable hosting downtime sla guarantee always available stable outage",
    links: [TERMS],
  },

  // ----------------------------------------------------------------- refunds
  {
    id: "refund-before-confirm",
    cat: "refunds",
    q: "Can I get a refund before my payment is confirmed?",
    a: "Yes. Email us before it is confirmed and we refund it, no questions asked.",
    k: "refund before confirmed unconfirmed cancel money back not verified yet",
    links: [TERMS],
  },
  {
    id: "refund-after-publish",
    cat: "refunds",
    q: "Can I get a refund after publishing?",
    a: "Once the website is published, the fee covers the work already done and is not refundable. If something is wrong on our end, we will make it right.",
    k: "refund after publish live not refundable published policy money back denied",
    links: [TERMS],
  },
  {
    id: "refund-how-request",
    cat: "refunds",
    q: "How do I request a refund?",
    a: "Email mzaheen3307@gmail.com from your account address with your website name and the transfer details.",
    k: "request refund how ask process email contact claim money back steps",
  },
  {
    id: "refund-timing",
    cat: "refunds",
    q: "How long does a refund take?",
    a: "It is a manual bank transfer back, usually within a few days once agreed.",
    k: "refund time how long days processing return bank transfer back speed",
  },
  {
    id: "refund-something-wrong",
    cat: "refunds",
    q: "The website has a problem, can I get money back?",
    a: "Tell us what is wrong first. Most issues get fixed. If it is a real fault on our end that cannot be fixed, we will make it right.",
    k: "problem broken fault refund compensation not working defect issue money back",
    links: [TERMS],
  },
  {
    id: "refund-changed-mind",
    cat: "refunds",
    q: "I changed my mind after paying but before publishing.",
    a: "If the payment is not confirmed yet, email us for a no questions refund. If it is already confirmed but you have not published, email us and we will sort it out.",
    k: "changed mind regret paid not published cancel refund back out reconsider",
  },

  // ------------------------------------------------------------------- trust
  {
    id: "trust-legit",
    cat: "trust",
    q: "Is this a real product or a scam?",
    a: "It is a real product with a public privacy policy, terms, a named contact, and a working sample website. Payment is manual bank transfer with a person confirming each one.",
    k: "scam legit real trust safe fake fraud genuine reliable trustworthy",
    links: [DEMO, TERMS],
  },
  {
    id: "trust-who-runs",
    cat: "trust",
    q: "Who runs this?",
    a: "A small independent maker. The contact for anything, payments, support or privacy, is mzaheen3307@gmail.com.",
    k: "who runs owns company team behind maker founder contact person independent",
  },
  {
    id: "trust-how-long-around",
    cat: "trust",
    q: "How long will the website stay online?",
    a: "The intent is long term, for as long as the product runs. There is no uptime guarantee, so keep your originals safe.",
    k: "how long online forever stay up future shut down years lifetime guarantee",
    links: [TERMS],
  },
  {
    id: "trust-content-ownership",
    cat: "trust",
    q: "Who owns the photos and words I upload?",
    a: "You do. Uploading them does not transfer any ownership. They are hosted only so your page can show them.",
    k: "own content photos words copyright rights ownership mine license upload keep",
    links: [TERMS],
  },
  {
    id: "trust-what-if-shutdown",
    cat: "trust",
    q: "What happens to my website if the service shuts down?",
    a: "That is why the terms tell you to keep copies of anything irreplaceable. Your camera roll originals and your own notes are the real backup.",
    k: "shutdown closes service ends what happens data website gone backup export",
  },
  {
    id: "trust-report-content",
    cat: "trust",
    q: "How do I report a website that misuses someone's photos?",
    a: "Email mzaheen3307@gmail.com with the address. Content that impersonates or harasses someone without consent can be taken down.",
    k: "report abuse misuse impersonation harassment fake takedown complaint someone else",
    links: [TERMS],
  },

  // -------------------------------------------------------------------- misc
  {
    id: "misc-contact",
    cat: "misc",
    q: "How do I contact a human?",
    a: "Email mzaheen3307@gmail.com. That is the one contact for support, payments and privacy.",
    k: "contact human support email help talk person reach get in touch customer service",
  },
  {
    id: "misc-response-time",
    cat: "misc",
    q: "How fast do you reply to email?",
    a: "Usually within a day. Payment confirmations are also handled by hand in about that time.",
    k: "response time reply email how fast slow answer wait support turnaround",
  },
  {
    id: "misc-feature-request",
    cat: "misc",
    q: "Can I suggest a feature?",
    a: "Yes, email it to mzaheen3307@gmail.com. Video, custom domains and shared editing are already on the list.",
    k: "feature request suggest idea roadmap wish add want missing improvement feedback",
  },
  {
    id: "misc-bug-report",
    cat: "misc",
    q: "How do I report a bug?",
    a: "Email mzaheen3307@gmail.com with what you did, what happened, your web address, and a screenshot if you have one.",
    k: "bug report problem issue glitch broken tell you error found defect",
  },
  {
    id: "misc-partner-gift-not-couple",
    cat: "misc",
    q: "Can I make one for my parents or a friend's wedding?",
    a: "It is built around two people and a shared story, so a parents' anniversary fits well. It is not a general event or invitation site.",
    k: "parents wedding friends anniversary gift others family not us couple use for",
  },
  {
    id: "misc-breakup",
    cat: "misc",
    q: "We broke up. What do I do with the website?",
    a: "Set it private so it stops loading, or email mzaheen3307@gmail.com to delete it and its photos for good.",
    k: "broke up breakup ended relationship over delete take down remove hide sad",
  },
  {
    id: "misc-gift-card",
    cat: "misc",
    q: "Do you sell gift cards?",
    a: "Not yet. To gift it, build the website for someone or cover their bank transfer with the website name in the note.",
    k: "gift card voucher certificate buy present prepaid code redeem",
  },
  {
    id: "misc-affiliate",
    cat: "misc",
    q: "Is there a referral or affiliate program?",
    a: "Not right now. If you want to share it, the sample website is the easiest thing to send a friend.",
    k: "referral affiliate partner program commission earn refer share link reward",
    links: [DEMO],
  },
];

/**
 * A handful of starter questions shown when the chat opens and when nothing
 * matches. Kept to the things people actually ask first.
 */
export const POPULAR_IDS = [
  "price-how-much",
  "start-how-it-works",
  "acct-first-link-expired",
  "price-free-to-build",
  "pub-how",
  "priv-who-sees",
  "play-what",
  "addr-what-is",
];

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "did", "i", "my", "me", "we",
  "our", "us", "you", "your", "it", "its", "to", "of", "for", "in", "on",
  "and", "or", "can", "how", "what", "when", "where", "why", "who", "will",
  "be", "have", "has", "get", "got", "with", "this", "that", "there", "if",
  "so", "at", "as", "from", "about", "any", "some", "am", "was", "were",
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// Precompute a token bag per entry once, at module load.
const INDEX = KNOWLEDGE_BASE.map((entry) => {
  const qTokens = normalize(entry.q);
  const kTokens = normalize(entry.k);
  return {
    entry,
    qSet: new Set(qTokens),
    kSet: new Set(kTokens),
    qJoined: entry.q.toLowerCase(),
  };
});

export type Match = { entry: HelpEntry; score: number };

/**
 * Score every entry against the user's text and return the best few. Pure
 * lexical overlap: a hit in the trigger words counts more than a hit in the
 * question text, and an exact-ish phrase gets a bump. No network, no model.
 */
export function matchQuery(input: string, limit = 3): Match[] {
  const tokens = normalize(input);
  if (tokens.length === 0) return [];
  const cleanInput = input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();

  const scored: Match[] = INDEX.map(({ entry, qSet, kSet, qJoined }) => {
    let score = 0;
    for (const t of tokens) {
      if (kSet.has(t)) score += 3;
      if (qSet.has(t)) score += 2;
    }
    // Whole phrase or near-phrase appears in the question text.
    if (cleanInput.length >= 6 && qJoined.includes(cleanInput)) score += 6;
    // Reward coverage: matched most of what they typed.
    const matched = tokens.filter((t) => kSet.has(t) || qSet.has(t)).length;
    if (matched >= 2) score += matched;
    return { entry, score };
  });

  return scored
    .filter((m) => m.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function entryById(id: string): HelpEntry | undefined {
  return KNOWLEDGE_BASE.find((e) => e.id === id);
}

export function entriesByCategory(cat: HelpCategory): HelpEntry[] {
  return KNOWLEDGE_BASE.filter((e) => e.cat === cat);
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as HelpCategory[];
