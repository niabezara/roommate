"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import FadeIn from "../FadeIn";
import LiveProjectButton from "../LiveProjectButton";

const img = (id: string) =>
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_${id}.png&w=1280&q=85`;

const projects = [
  {
    name: "Nextlevel Studio", category: "Client",
    images: [img("20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db"), img("20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8"), img("20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327")],
  },
  {
    name: "Aura Brand Identity", category: "Personal",
    images: [img("20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f"), img("20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1"), img("20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea")],
  },
  {
    name: "Solaris Digital", category: "Client",
    images: [img("20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f"), img("20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b"), img("20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee")],
  },
];

const radius = "rounded-[40px] sm:rounded-[50px] md:rounded-[60px]";

function Card({ project, index, total, progress }: { project: (typeof projects)[number]; index: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const [a, b, c] = project.images;

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.div
        className={`relative w-full max-w-6xl origin-top border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${radius}`}
        style={{ scale, top: `${index * 28}px` }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">{project.category}</span>
              <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a} alt={`${project.name} preview 1`} loading="lazy" className={`w-full object-cover ${radius}`} style={{ height: "clamp(130px, 16vw, 230px)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b} alt={`${project.name} preview 2`} loading="lazy" className={`w-full object-cover ${radius}`} style={{ height: "clamp(160px, 22vw, 340px)" }} />
          </div>
          <div className="w-[60%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c} alt={`${project.name} main`} loading="lazy" className={`h-full w-full object-cover ${radius}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Project
      </FadeIn>
      <div ref={container}>
        {projects.map((p, i) => (
          <Card key={p.name} project={p} index={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
