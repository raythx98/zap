
import { cn } from "@/lib/utils"

const Input = ({ className, type, error, ref, ...props }) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        error ? "border-red-500 ring-red-500/20 focus-visible:ring-red-500 animate-shake" : "border-input",
        className
      )}
      ref={ref}
      {...props} />)
  );
}

export { Input }
