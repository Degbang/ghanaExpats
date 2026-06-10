"use client";

import { useEffect, useRef, useState } from "react";

export function CounterRoll({ target = 26500, duration = 1800, className = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let frame = 0;
    let started = false;

    const animate = (startTime) => (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate(startTime));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            frame = window.requestAnimationFrame((timestamp) => animate(timestamp)(timestamp));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [duration, target]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-GB")}
    </span>
  );
}
