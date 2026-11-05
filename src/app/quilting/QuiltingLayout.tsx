import Link from "next/link";

export default function QuiltingLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-bark-400"><Link href="/" className="hover:text-plum-500">Home</Link> <span aria-hidden="true">/</span> <Link href="/quilting" className="hover:text-plum-500">Quilting</Link> <span aria-hidden="true">/</span> <span className="text-bark-600">{title}</span></nav>
    <h1 className="text-2xl sm:text-3xl font-display text-bark-800">{title}</h1>
    <p className="mt-3 text-bark-600 leading-relaxed">{description}</p>
    {children}
  </section>;
}
