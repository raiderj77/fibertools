import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download your Planned Pooling Project Pack",
  description: "Download the printable Planned Pooling Project Pack and keep your project worksheets together.",
  alternates: { canonical: "/planned-pooling-project-pack/download" },
  robots: { index: false },
};

export default function PoolingPackDownloadPage() {
  return <div className="mx-auto max-w-xl px-6 py-20 text-bark-800 dark:text-cream-100">
    <h1 className="text-4xl font-bold">Thank you for choosing the Planned Pooling Project Pack</h1>
    <p className="mt-6 leading-relaxed">Your purchase is a printable PDF with pooling worksheets, three worked projects, a dye-lot checklist, and a troubleshooting grid.</p>
    <a href="/planned-pooling-project-pack.pdf" download="Planned-Pooling-Project-Pack.pdf" className="btn-primary mt-8 inline-block">Download your Planned Pooling Project Pack</a>
    <p className="mt-6 leading-relaxed">This page is the delivery link from the Stripe confirmation. Keep the confirmation email and link, and save your PDF. Access is link-based with no account; anyone with the link can access the file. This page itself does not verify payment.</p>
    <p className="mt-4">Some browsers open the PDF instead of saving it; use the PDF viewer&apos;s download control to keep a copy.</p>
    <div className="mt-8 flex flex-col gap-4"><Link href="/planned-pooling-project-pack" className="underline">Back to the project pack</Link><Link href="/color-pooling-calculator" className="underline">Use the free pooling calculator</Link></div>
  </div>;
}
