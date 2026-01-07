import { Car, Clock, Shield } from "lucide-react";

export default function FeatureCard({ icon, title, description }) {
  const IconComponent = { Car, Clock, Shield }[icon] || Car;
  return (
    <div className="flex flex-col items-center">
      <IconComponent className="text-[var(--btn-bg)] w-12 h-12 mb-4" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-[var(--text-muted)] mt-2">{description}</p>
    </div>
  );
}
