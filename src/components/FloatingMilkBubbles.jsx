// Fixed (non-random) bubble configs so positions stay stable across re-renders.
const bubbles = [
  { left: "5%", size: 10, delay: 0, duration: 9 },
  { left: "14%", size: 6, delay: 1.4, duration: 7.5 },
  { left: "24%", size: 14, delay: 2.8, duration: 11 },
  { left: "34%", size: 8, delay: 0.6, duration: 8 },
  { left: "45%", size: 5, delay: 3.6, duration: 6.5 },
  { left: "55%", size: 12, delay: 1.9, duration: 10 },
  { left: "65%", size: 7, delay: 4.4, duration: 7.5 },
  { left: "75%", size: 9, delay: 0.2, duration: 9.5 },
  { left: "85%", size: 5, delay: 2.6, duration: 6 },
  { left: "93%", size: 11, delay: 3.2, duration: 10.5 },
  { left: "20%", size: 6, delay: 5.1, duration: 8.5 },
  { left: "60%", size: 8, delay: 5.8, duration: 9 },
];

export default function FloatingMilkBubbles({ variant = "dark" }) {
  const color = variant === "dark" ? "rgba(255,255,255,0.4)" : "rgba(69,107,46,0.12)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="milk-bubble absolute bottom-0 rounded-full"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            backgroundColor: color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
