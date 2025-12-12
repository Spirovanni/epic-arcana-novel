import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { careerCatalog } from "@/data/careers";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return careerCatalog.map((career) => ({ slug: career.slug }));
}

export default async function CareerDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const career = careerCatalog.find((c) => c.slug === slug);

  if (!career) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden pb-20">
        <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/30" />
          <div className="absolute right-12 top-24 h-48 w-48 rounded-full bg-cyan-500/20" />
          <div className="absolute left-12 bottom-12 h-56 w-56 rounded-full bg-indigo-500/20" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-12">
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="ghost" className="text-slate-200">
              <Link href="/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to careers
              </Link>
            </Button>
            <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-400">{career.category}</Badge>
          </div>

          <header className="space-y-4">
            <div className="flex items-center gap-2 text-amber-200">
              <Target className="h-4 w-4" />
              Role overview
            </div>
            <h1 className="text-4xl font-semibold text-white">{career.title}</h1>
            <p className="text-lg text-slate-300">{career.summary}</p>
            <div className="flex flex-wrap gap-2">
              {career.signal.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="border-slate-700 bg-slate-800 text-slate-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Where you&apos;ll thrive</CardTitle>
                <CardDescription className="text-slate-300">{career.context}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-200">Shine</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {career.shine.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-200">Build next</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {career.buildNext.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-200">Impact you drive</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {career.outcomes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-200">Evidence to collect</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {career.artifacts.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Day-to-day</CardTitle>
                <CardDescription className="text-slate-300">
                  How a typical week looks when you’re winning in this role.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-200">
                {career.dayToDay.map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </div>
                ))}
                <Button asChild className="mt-2 bg-amber-500 text-slate-950 hover:bg-amber-400">
                  <Link href="/assessment">
                    Start with your assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
