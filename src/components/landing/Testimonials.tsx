"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior SWE at Google",
    avatar: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    initials: "SC",
    quote: "I applied to 12 companies and got 9 responses in the first week. ZoraCV's ATS optimization is legitimately game-changing.",
    rating: 5,
    badge: "Google",
  },
  {
    name: "Marcus Williams",
    role: "Product Manager at Stripe",
    avatar: "bg-gradient-to-br from-violet-400 to-violet-600",
    initials: "MW",
    quote: "Went from 0 to 3 offers in 3 weeks. The live ATS score let me iterate my resume in real time — took the guesswork out completely.",
    rating: 5,
    badge: "Stripe",
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist at Meta",
    avatar: "bg-gradient-to-br from-rose-400 to-rose-600",
    initials: "PS",
    quote: "The templates look genuinely premium. My hiring manager commented on how clean and readable my resume was.",
    rating: 5,
    badge: "Meta",
  },
  {
    name: "James Rodriguez",
    role: "Marketing Lead at Notion",
    avatar: "bg-gradient-to-br from-amber-400 to-amber-600",
    initials: "JR",
    quote: "The AI suggestions are actually specific and actionable — not generic filler. I still can't believe this platform is completely free.",
    rating: 5,
    badge: "Notion",
  },
  {
    name: "Elena Rostova",
    role: "Frontend Developer",
    avatar: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    initials: "ER",
    quote: "Finally a builder that doesn't mess up my formatting when exporting to PDF. The live preview is flawless.",
    rating: 5,
    badge: "Tech",
  },
  {
    name: "David Kim",
    role: "Financial Analyst",
    avatar: "bg-gradient-to-br from-sky-400 to-sky-600",
    initials: "DK",
    quote: "The clean, corporate templates helped me pass the strict ATS filters at major banks. Highly recommended.",
    rating: 5,
    badge: "Finance",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="w-[380px] flex-shrink-0 group relative p-[1px] rounded-3xl bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/0 to-amber-400/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl" />
      <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[23px] p-7 flex flex-col justify-between overflow-hidden">
        <Quote className="absolute top-6 right-6 w-20 h-20 text-slate-100 dark:text-slate-800/50 -rotate-12 transition-transform duration-500 group-hover:rotate-0" />
        <div className="relative z-10">
          <div className="flex gap-1 mb-5">
            {[...Array(t.rating)].map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed mb-8 relative z-10">
            &ldquo;{t.quote}&rdquo;
          </p>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-5 mt-auto">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full ${t.avatar} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-900`}>
              {t.initials}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{t.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.role}</div>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t.badge}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  duration = 40,
}: {
  items: (typeof testimonials);
  direction?: "left" | "right";
  duration?: number;
}) {
  const animClass = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="overflow-hidden flex w-full relative py-4 touch-pan-y" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div
        className={`flex gap-6 px-3 ${animClass} [animation-play-state:running] hover:[animation-play-state:paused]`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-orange-400/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header — CSS fade-in via animate-fade-up class */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full mb-16 text-center animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-5 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          Success Stories
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Loved by{" "}
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            120,000+ professionals
          </span>
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Join the thousands of job seekers landing their dream roles with our free, ATS-optimized builder.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4 relative z-10 -rotate-2 scale-105">
        <MarqueeRow items={testimonials.slice(0, 3)} direction="right" duration={35} />
        <MarqueeRow items={testimonials.slice(3, 6)} direction="left"  duration={28} />
      </div>
    </section>
  );
}
