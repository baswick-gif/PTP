import { Star } from 'lucide-react';

export default function StarRating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-lagoon text-lagoon' : 'text-ink-45'}`}
          />
        ))}
      </div>
      <span className="text-sm text-ink-70 font-mono">
        {rating} ({reviewCount})
      </span>
    </div>
  );
}
