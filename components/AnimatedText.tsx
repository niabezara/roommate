"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type CSSProperties } from "react";

function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const total = text.length;
  let index = 0;
  const words = text.split(" ");

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, w) => {
        const chars = word.split("").map((c) => {
          const i = index++;
          return <Char key={i} char={c} progress={scrollYProgress} range={[i / total, (i + 1) / total]} />;
        });
        if (w < words.length - 1) index++; // the space
        return (
          <span key={w} className="inline-block whitespace-nowrap">
            {chars}
            {w < words.length - 1 && " "}
          </span>
        );
      })}
    </p>
  );
}
