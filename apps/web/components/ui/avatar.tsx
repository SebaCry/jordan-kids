import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const colorPairs = [
  { bg: "bg-primary-200", text: "text-primary-800" },
  { bg: "bg-secondary-200", text: "text-secondary-800" },
  { bg: "bg-accent-200", text: "text-accent-800" },
  { bg: "bg-success-200", text: "text-success-800" },
  { bg: "bg-pink-200", text: "text-pink-800" },
  { bg: "bg-teal-200", text: "text-teal-800" },
];

function getColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPairs[Math.abs(hash) % colorPairs.length];
}

function Avatar({ src, alt, name, size = "md", className, ...props }: AvatarProps) {
  const initials = getInitials(name);
  const colors = getColorFromName(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold",
        sizeClasses[size],
        !src && colors.bg,
        !src && colors.text,
        className
      )}
      role="img"
      aria-label={alt || name}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
