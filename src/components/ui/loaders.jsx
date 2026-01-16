import { cn } from "@/lib/utils";

export const BarLoader = ({ className }) => (
  <div className={cn("h-1 w-full bg-gray-800 overflow-hidden relative", className)}>
    <div className="absolute inset-0 bg-blue-500 animate-progress origin-left" />
  </div>
);

export const BeatLoader = ({ size = 10, color = "currentColor", className }) => (
  <div className={cn("flex items-center gap-1", className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="rounded-full animate-bounce"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);
