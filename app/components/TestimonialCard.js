import { Users, Star } from "lucide-react";

export default function TestimonialCard({ review }) {
  return (
    <div className="card p-4 text-center">
      <Users className="text-[var(--btn-bg)] w-10 h-10 mx-auto mb-3" />
      <p className="text-lg font-semibold">{review.name}</p>
      <p className="text-[var(--text-muted)] mt-2">"{review.review}"</p>
      <div className="flex justify-center mt-2">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="text-yellow-500 w-5 h-5" />
        ))}
      </div>
    </div>
  );
}
