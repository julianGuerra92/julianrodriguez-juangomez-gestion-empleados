import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type CardVariant = "primary" | "secondary" | "accent";

interface FeatureCardProps {
  icon: ReactNode;
  variant?: CardVariant;
  title: string;
  description: string;
  href: string;
}

const iconBgMap: Record<CardVariant, string> = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  accent: "bg-accent/10",
};

const iconColorMap: Record<CardVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const btnMap: Record<CardVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
};

export function FeatureCard({
  icon,
  variant = "primary",
  title,
  description,
  href,
}: FeatureCardProps) {
  return (
    <div className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="card-body items-center text-center gap-4">
        <div
          className={`w-14 h-14 ${iconBgMap[variant]} rounded-2xl flex items-center justify-center`}
        >
          <span className={iconColorMap[variant]}>{icon}</span>
        </div>
        <h3 className="card-title text-xl">{title}</h3>
        <p className="text-base-content/60">{description}</p>
        <div className="card-actions mt-2">
          <Link href={href} className={`btn ${btnMap[variant]} btn-sm gap-1`}>
            Acceder <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
