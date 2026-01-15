import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { useRef } from 'react';

interface AnimatedStarRatingProps {
  rating: number;
  max?: number;
}

export function AnimatedStarRating({ rating, max = 5 }: AnimatedStarRatingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.3,
            delay: i * 0.1,
            type: "spring",
            stiffness: 200
          }}
        >
          <Star
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-gold-500 text-gold-500'
                : 'text-forest-200'
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}
