"use client";
import { motion } from "framer-motion";

/** Hand-drawn SVG pizza used in the hero and as image fallback */
export function PizzaArt({ animate = true, className }) {
  const pepperoni = [[150, 110], [250, 125], [110, 200], [200, 190], [290, 215], [150, 285], [245, 295], [200, 130]];
  const basil = [[175, 235], [265, 170], [130, 150], [215, 255]];
  const olives = [[190, 85], [95, 245], [305, 150], [215, 330]];
  const pop = (i) => (animate ? { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 0.5 + i * 0.09, type: "spring", stiffness: 260, damping: 16 } } : {});
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Illustration of a pepperoni pizza">
      <motion.g {...(animate ? { initial: { rotate: -25, opacity: 0 }, animate: { rotate: 0, opacity: 1 }, transition: { duration: 0.8, ease: "easeOut" } } : {})} style={{ originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="205" r="178" fill="#00000018" />
        <circle cx="200" cy="200" r="178" fill="#e9a54b" />
        <circle cx="200" cy="200" r="178" fill="none" stroke="#c9822a" strokeWidth="6" />
        <circle cx="200" cy="200" r="150" fill="#c62d1f" />
        <circle cx="200" cy="200" r="142" fill="#f6c453" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M200 200 L${200 + 142 * Math.cos((i * Math.PI) / 3)} ${200 + 142 * Math.sin((i * Math.PI) / 3)}`} stroke="#c9822a" strokeOpacity=".55" strokeWidth="2" />
        ))}
      </motion.g>
      {pepperoni.map(([x, y], i) => (
        <motion.g key={`p${i}`} {...pop(i)} style={{ originX: `${x}px`, originY: `${y}px` }}>
          <circle cx={x} cy={y} r="24" fill="#a8261a" />
          <circle cx={x - 6} cy={y - 5} r="4" fill="#d4584a" />
          <circle cx={x + 7} cy={y + 6} r="3" fill="#7d1a11" />
        </motion.g>
      ))}
      {basil.map(([x, y], i) => (
        <motion.path key={`b${i}`} d={`M${x} ${y} q18 -26 36 0 q-18 26 -36 0z`} fill="#2f5d3a" transform={`rotate(${i * 50} ${x + 18} ${y})`} {...pop(i + 8)} />
      ))}
      {olives.map(([x, y], i) => (
        <motion.g key={`o${i}`} {...pop(i + 12)} style={{ originX: `${x}px`, originY: `${y}px` }}>
          <circle cx={x} cy={y} r="10" fill="#2a1710" />
          <circle cx={x} cy={y} r="4" fill="#f6c453" />
        </motion.g>
      ))}
    </svg>
  );
}

/** Image with a pizza fallback so cards never show a broken image */
export function PizzaImage({ src, alt = "", className = "" }) {
  if (!src)
    return (
      <div className={`flex items-center justify-center bg-surface-2 ${className}`}>
        <PizzaArt animate={false} className="size-2/3" />
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}
