import { loadExtendedCanonicalProfiles } from "@/lib/data";
import Link from "next/link";
import { loadExtendedCanonicalProfiles } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Compass,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { careerCatalog, Career } from "@/data/careers";

type SkillPlan = {
  label: string;
  current: number;
  target: number;
  note: string;
};

type CareerOption = {
  title: string;
  match: number;
  context: string;
  shine: string[];
  buildNext: string[];
  signal: string[];
};

async function getPersonalitySnapshot() {
  const profiles = await loadExtendedCanonicalProfiles();
  const profile = profiles[0];

  const strengths = profile.traits?.strengths?.slice(0, 3) ?? [];
  const growth = profile.traits?.growth_focus?.slice(0, 3) ?? [];
  const values = profile.thematic_essence
    ? Object.values(profile.thematic_essence).filter(Boolean).slice(0, 3)
    : [];

  return {
    name: profile.display_name ?? profile.theme ?? "Personality Profile",
    headline: profile.summary ?? profile.theme ?? "Your personality insights",
    drivers: strengths.length > 0 ? strengths : ["Lead with your core strengths", "Pair with a clear mission", "Prioritize momentum"],
    values: values.length > 0 ? (values as string[]) : ["Autonomy", "Impact", "Craft"],
    growth: growth.length > 0 ? growth : ["Focus one craft skill", "Practice influence weekly", "Protect recovery blocks"],
    family: profile.family ?? "Explorer",
  };
}

function buildSkillPlan(growth: string[]): SkillPlan[] {
  const basePlan: SkillPlan[] = [
    {
      label: "Influence & alignment",
      current: 68,
      target: 88,
      note: growth[0] ?? "Practice crisp decision memos and short verbal frames.",
    },
    {
      label: "Systems thinking",
      current: 74,
      target: 92,
      note: growth[1] ?? "Map constraints early, then prune complexity.",
    },
    {
      label: "Story & data",
      current: 64,
      target: 85,
      note: growth[2] ?? "Tighten insight → implication → action loops.",
    },
  ];

  return basePlan;
}

type CareerCard = Career & { displayMatch: number };

function personalizeCareer(career: Career, family: string): CareerCard {
  const normalizedFamily = family.toLowerCase();
  let boost = 0;
  if (normalizedFamily.includes("strategist") || normalizedFamily.includes("explorer")) {
    if (career.slug === "product-strategist" || career.slug === "customer-insights-lead") boost = 2;
  }
  if (normalizedFamily.includes("creator") || normalizedFamily.includes("story")) {
    if (career.slug === "learning-experience-designer") boost = 3;
  }

  return { ...career, displayMatch: Math.min(98, career.match + boost) };
}

function buildCareerOptions(family: string): CareerCard[] {
  return careerCatalog.map((career) => personalizeCareer(career, family));
}

const nextSteps = [
  {
    title: "Anchor your fit story",
    detail: "Write a 5-sentence narrative: who you serve, problems you love, outcomes you drive, and proof points.",
  },
  {
    title: "Pick two skill gaps to close",
    detail: "Choose one influence skill and one craft skill; schedule weekly reps with a simple metric for each.",
  },
  {
    title: "Run a 30-day field test",
    detail: "Shadow or project-pair with someone already in the role; ship one tangible artifact per week.",
  },
  {
    title: "Build your evidence locker",
    detail: "Collect before/after screenshots, decision memos, and user quotes to prove momentum.",
  },
];

export default async function CareersPage() {
  const snapshot = await getPersonalitySnapshot();
  const strengths = snapshot.drivers;
  const skillPlan = buildSkillPlan(snapshot.growth);
  const careerOptions = buildCareerOptions(snapshot.family);
  const groupedCareers = careerOptions.reduce<Record<string, CareerCard[]>>((acc, career) => {
    acc[career.category] = acc[career.category] ? [...acc[career.category], career] : [career];
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-50 blur-3xl">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/40" />
          <div className="absolute right-12 top-24 h-48 w-48 rounded-full bg-cyan-500/30" />
          <div className="absolute left-12 bottom-12 h-56 w-56 rounded-full bg-indigo-500/30" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-16">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-200 ring-1 ring-amber-400/40">
              <Sparkles className="h-4 w-4" />
              Career navigation powered by your personality
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
              <div>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Find the role where your personality and skills compound.
                </h1>
                <p className="mt-4 text-lg text-slate-300">
                  Translate who you are into how you work. See where your strengths win, what to
                  develop next, and which environments let you deliver consistent impact.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400">
                    Start with your assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-slate-700 bg-white/5 text-white hover:bg-white/10">
                    View personalized dashboard
                  </Button>
                </div>
              </div>
              <Card className="border-slate-800 bg-white/5 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2 text-amber-200">
                    <Compass className="h-4 w-4" />
                    Current personality signal
                  </div>
                  <CardTitle className="text-2xl text-white">
                    {snapshot.name}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {snapshot.headline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {snapshot.values.map((value) => (
                      <Badge key={value} variant="secondary" className="border-slate-700 bg-slate-800 text-slate-100">
                        {value}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    {snapshot.drivers.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-amber-200">Growth focus</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-200">
                      {snapshot.growth.map((focus) => (
                        <li key={focus} className="flex items-start gap-2">
                          <Target className="mt-0.5 h-4 w-4 text-amber-400" />
                          {focus}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2 text-amber-200">
                  <Workflow className="h-4 w-4" />
                  Work context that fits
                </div>
                <CardTitle className="text-white">Environments where you’ll thrive</CardTitle>
                <CardDescription className="text-slate-300">
                  Align the day-to-day with how you make decisions, recharge, and communicate.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Decision cadence",
                    detail: "Weekly prioritization beats; async-friendly with crisp briefs.",
                  },
                  {
                    title: "Team topology",
                    detail: "Small pods (4–8) with direct access to leadership and users.",
                  },
                  {
                    title: "Feedback loops",
                    detail: "Frequent user contact; tests that ship insights, not just reports.",
                  },
                  {
                    title: "Energy management",
                    detail: "Deep-work blocks protected; recovery after intense launches.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-amber-500/5"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2 text-amber-200">
                  <Target className="h-4 w-4" />
                  Skill focus plan
                </div>
                <CardTitle className="text-white">Close the gap with intent</CardTitle>
                <CardDescription className="text-slate-300">
                  Pick two skills to accelerate now; revisit monthly as your role evolves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillPlan.map((skill) => (
                  <div key={skill.label} className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <p className="font-semibold text-white">{skill.label}</p>
                      <span className="text-amber-300">
                        {skill.current}% → {skill.target}%
                      </span>
                    </div>
                    <Progress
                      value={(skill.current / skill.target) * 100}
                      className="mt-3 h-2 bg-slate-800"
                    />
                    <p className="mt-2 text-sm text-slate-300">{skill.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm uppercase tracking-wide text-amber-200">Role short list</p>
                <h2 className="text-2xl font-semibold text-white">Career matches grouped by path</h2>
                <p className="text-slate-300">
                  Explore the clusters below and click into any role to see its dedicated page.
                </p>
              </div>
              <Button variant="outline" className="border-slate-700 bg-white/5 text-white hover:bg-white/10">
                <Link href="/careers">Compare roles</Link>
              </Button>
            </div>

            <div className="space-y-8">
              {Object.entries(groupedCareers).map(([category, roles]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <h3 className="text-lg font-semibold text-white">{category}</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {roles.map((career) => (
                      <Card key={career.slug} className="border-slate-800 bg-slate-900/70 backdrop-blur">
                        <CardHeader className="space-y-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-white">
                              <Link href={`/careers/${career.slug}`} className="hover:text-amber-200">
                                {career.title}
                              </Link>
                            </CardTitle>
                            <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-400">
                              {career.displayMatch}% fit
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-300">{career.context}</CardDescription>
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
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-amber-200">
                              Where you&apos;ll shine
                            </p>
                            <ul className="space-y-1 text-slate-200">
                              {career.shine.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-amber-200">
                              Build next
                            </p>
                            <ul className="space-y-1 text-slate-200">
                              {career.buildNext.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Link href={`/careers/${career.slug}`} className="inline-flex items-center text-amber-200 hover:text-amber-100">
                            View role page <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
            <Card className="border-slate-800 bg-white/5 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2 text-amber-200">
                  <Sparkles className="h-4 w-4" />
                  30–60–90 momentum map
                </div>
                <CardTitle className="text-white">Prove fit in 12 weeks</CardTitle>
                <CardDescription className="text-slate-300">
                  A lightweight runway to demonstrate you can win the role you’re aiming for.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: "Days 1–30",
                    bullets: [
                      "Ship one insight artifact per week (brief, storyboard, decision memo).",
                      "Set two practice reps: stakeholder summary and user call recap.",
                    ],
                  },
                  {
                    title: "Days 31–60",
                    bullets: [
                      "Run a mini experiment with clear success criteria.",
                      "Host a 45-minute alignment session to sharpen priorities.",
                    ],
                  },
                  {
                    title: "Days 61–90",
                    bullets: [
                      "Publish a before/after case study with metrics.",
                      "Teach one skill you leveled up to your team or community.",
                    ],
                  },
                ].map((phase) => (
                  <div
                    key={phase.title}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-cyan-500/10"
                  >
                    <p className="text-sm font-semibold text-white">{phase.title}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-200">
                      {phase.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-amber-500/10 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2 text-amber-200">
                  <Target className="h-4 w-4" />
                  Next best moves
                </div>
                <CardTitle className="text-white">What to do this week</CardTitle>
                <CardDescription className="text-slate-100/80">
                  Small, high-leverage steps to validate your direction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {nextSteps.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-lg border border-amber-400/30 bg-slate-950/40 p-3 shadow-inner shadow-amber-500/10"
                  >
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-slate-100/80">{step.detail}</p>
                  </div>
                ))}
                <Button className="mt-2 w-full bg-white text-slate-900 hover:bg-slate-100">
                  Download your plan
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
