import FadeIn from "../FadeIn";
import ContactButton from "../ContactButton";
import LivingPortrait from "../LivingPortrait";

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: "clip" }}>
      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:mt-8 sm:text-[15vw] md:mt-6 md:text-[16vw] lg:text-[17.5vw]"
        >
          Hi Irinka
        </FadeIn>
      </div>

      <div className="flex-1" />

      <div className="relative z-20 flex items-end justify-end px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <LivingPortrait />
    </section>
  );
}
