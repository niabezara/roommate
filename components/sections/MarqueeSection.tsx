"use client";

import { useEffect, useRef } from "react";

const A = "https://motionsites.ai/assets/";
const IMAGES = [
  "hero-space-voyage-preview-eECLH3Yc.gif", "hero-codenest-preview-Cgppc2qV.gif", "hero-vex-ventures-preview-BczMFIiw.gif",
  "hero-stellar-ai-v2-preview-DjvxjG3C.gif", "hero-asme-preview-B_nGDnTP.gif", "hero-transform-data-preview-Cx5OU29N.gif",
  "hero-vitara-preview-Cjz2QYyU.gif", "hero-terra-preview-BFjrCr7T.gif", "hero-skyelite-preview-DHaZIgUv.gif",
  "hero-aethera-preview-DknSlcTa.gif", "hero-designpro-preview-D8c5_een.gif", "hero-stellar-ai-preview-D3HL6bw1.gif",
  "hero-xportfolio-preview-D4A8maiC.gif", "hero-orbit-web3-preview-BXt4OttD.gif", "hero-nexora-preview-cx5HmUgo.gif",
  "hero-evr-ventures-preview-DZxeVFEX.gif", "hero-planet-orbit-preview-DWAP8Z1P.gif", "hero-new-era-preview-CocuDUm9.gif",
  "hero-wealth-preview-B70idl_u.gif", "hero-luminex-preview-CxOP7ce6.gif", "hero-celestia-preview-0yO3jXO8.gif",
].map((f) => A + f);

const ROW1 = [...IMAGES.slice(0, 11), ...IMAGES.slice(0, 11), ...IMAGES.slice(0, 11)];
const ROW2 = [...IMAGES.slice(11), ...IMAGES.slice(11), ...IMAGES.slice(11)];

function Row({ images, rowRef }: { images: string[]; rowRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div ref={rowRef} className="flex w-max gap-3" style={{ willChange: "transform" }}>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const section = useRef<HTMLElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!section.current) return;
      const sectionTop = section.current.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      if (row1.current) row1.current.style.transform = `translateX(${offset - 200}px)`;
      if (row2.current) row2.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={section} className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <Row images={ROW1} rowRef={row1} />
        </div>
        <Row images={ROW2} rowRef={row2} />
      </div>
    </section>
  );
}
