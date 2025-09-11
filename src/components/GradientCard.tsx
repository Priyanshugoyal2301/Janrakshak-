import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
  hover?: boolean;
}

const GradientCard = ({
  children,
  className,
  variant = "default",
  hover = true,
}: GradientCardProps) => {
  const variants = {
    default:
      "bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-blue-200/50",
    success:
      "bg-gradient-to-br from-white to-green-50 border-green-100 hover:shadow-green-200/50",
    warning:
      "bg-gradient-to-br from-white to-yellow-50 border-yellow-100 hover:shadow-yellow-200/50",
    danger:
      "bg-gradient-to-br from-white to-red-50 border-red-100 hover:shadow-red-200/50",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border backdrop-blur-sm shadow-lg transition-all duration-300",
        variants[variant],
        hover && "hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GradientCard;
