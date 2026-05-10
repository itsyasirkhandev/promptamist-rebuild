import { cn } from "@/lib/utils";
import "./loader.css";

interface LoaderProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * A custom 3D animated loader component.
 * 
 * @param className - Additional classes for the container
 * @param size - Size of the loader in pixels (default: 48)
 * @param color - Primary color of the loader (default: currentColor or #fff)
 * @param accentColor - Accent color of the loader (default: #FF3D00)
 */
export function Loader({ 
  className, 
  size = 48, 
  color, 
  accentColor 
}: LoaderProps) {
  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      style={{
        "--loader-color": color || "currentColor",
        "--loader-accent": accentColor || "#FF3D00",
      } as React.CSSProperties}
    >
      <span 
        className="loader" 
        style={{ 
          width: size, 
          height: size 
        }}
      />
    </div>
  );
}
